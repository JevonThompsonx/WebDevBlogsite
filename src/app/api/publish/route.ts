import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

import { revalidatePostPages } from "@/lib/revalidation";
import { slugify } from "@/lib/utils";
import {
  PostConflictError,
  insertPost,
  slugExists,
} from "@/server/queries/posts";
import { coverImageUrl as toCoverImageUrl } from "@/lib/cloudinary/transform";
import { uploadCoverImage, validateCoverImage } from "@/lib/cloudinary/uploads";
import { publishPostSchema } from "@/schemas/publish";

export const runtime = "nodejs";

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(
  message: string,
  details?: Record<string, string>,
): NextResponse {
  return NextResponse.json(
    { error: "Validation failed", message, ...(details ? { details } : {}) },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  // 1. Authenticate — read PUBLISH_TOKEN at request time for testability
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized();
  }

  const providedToken = authHeader.slice(7);
  const expectedToken = process.env.PUBLISH_TOKEN;

  if (!expectedToken) {
    return unauthorized();
  }

  const hashA = createHash("sha256").update(providedToken).digest();
  const hashB = createHash("sha256").update(expectedToken).digest();
  if (!timingSafeEqual(hashA, hashB)) {
    return unauthorized();
  }

  // 2. Early Content-Length guard (C1) — applied to BOTH branches
  const MAX_PAYLOAD_BYTES = 11 * 1024 * 1024;
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const parsedLength = parseInt(contentLengthHeader, 10);
    if (!Number.isNaN(parsedLength) && parsedLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
  }

  // 2. Parse input
  let title = "";
  let content = "";
  let slug = "";
  let category = "Technical";
  let published = true;
  let excerpt = "";
  let coverImageUrl: string | null = null;
  let imageFile: File | null = null;

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid multipart body" },
        { status: 400 },
      );
    }
    title = (formData.get("title") as string) || "";
    content = (formData.get("content") as string) || "";
    slug = ((formData.get("slug") as string) || "").trim();
    category = ((formData.get("category") as string) || "Technical").trim();
    const publishedRaw = (formData.get("published") as string) || "true";
    published = publishedRaw === "true" || publishedRaw === "on";
    excerpt = ((formData.get("excerpt") as string) || "").trim();
    const coverImageRaw = formData.get("coverImage");
    if (coverImageRaw instanceof File && coverImageRaw.size > 0) {
      imageFile = coverImageRaw;
    } else if (typeof coverImageRaw === "string") {
      coverImageUrl = coverImageRaw.trim() || null;
    } else {
      coverImageUrl = null;
    }
  } else {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return badRequest("Invalid JSON body.", { body: "Invalid JSON body." });
    }
    title = (body.title as string) || "";
    content = (body.content as string) || "";
    slug = ((body.slug as string) || "").trim();
    category = ((body.category as string) || "Technical").trim();
    if (typeof body.published === "boolean") {
      published = body.published;
    } else if (body.published === undefined) {
      published = true;
    } else {
      return badRequest("Published must be a boolean.", {
        published: "Published must be a boolean.",
      });
    }
    excerpt = ((body.excerpt as string) || "").trim();
    coverImageUrl = ((body.coverImage as string) || "").trim() || null;
  }

  // 2b. Derive slug before schema validation if not provided
  if (!slug) {
    slug = slugify(title);
  }

  // 2c. Validate via publishPostSchema (wired)
  // slug is required after derivation — pass empty string through to trigger
  // schema's min(1) error instead of bypassing via undefined (optional)
  const parsed = publishPostSchema.safeParse({
    title: title.trim() ? title : "",
    content: content.trim() ? content : "",
    slug: slug,
    category: category || undefined,
    excerpt: excerpt || undefined,
    coverImage: coverImageUrl ?? "",
    published,
  });

  if (!parsed.success) {
    const details: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!details[key]) details[key] = issue.message;
    }
    // Handle derived slug empty case: zod reports slug required, but route should surface as slug error
    // If title was "???!!!" slug becomes "" and schema will error on slug — details already contains slug
    const firstMessage = parsed.error.issues[0]?.message ?? "Validation failed";
    return badRequest(firstMessage, details);
  }

  // Normalize after schema validation (schema trims)
  title = parsed.data.title;
  content = parsed.data.content;
  slug = parsed.data.slug ?? slug;
  category = parsed.data.category ?? "Technical";
  excerpt = parsed.data.excerpt ?? "";
  // coverImageUrl handled separately for File vs URL; parsed.data.coverImage is validated string
  // keep coverImageUrl as is (already trimmed) but ensure empty string becomes null for logic below
  if (coverImageUrl === "") coverImageUrl = null;
  published = parsed.data.published ?? true;

  // 4. Handle image
  if (imageFile) {
    try {
      await validateCoverImage(imageFile);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image validation failed.";
      return badRequest(message, { coverImage: message });
    }

    try {
      const uploadedUrl = await uploadCoverImage(imageFile);
      coverImageUrl = uploadedUrl;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 502 },
      );
    }
  } else if (coverImageUrl) {
    if (coverImageUrl.startsWith("/images/")) {
      // Local paths allowed — no host validation
    } else {
      try {
        const parsedUrl = new URL(coverImageUrl);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          return badRequest("Cover image must be a valid HTTP/HTTPS URL.", {
            coverImage: "Cover image must be a valid HTTP/HTTPS URL.",
          });
        }
        if (parsedUrl.hostname.toLowerCase() !== "res.cloudinary.com") {
          return badRequest("Cover image host not allowed.", {
            coverImage: "Cover image host not allowed.",
          });
        }
      } catch {
        return badRequest("Cover image must be a valid URL.", {
          coverImage: "Cover image must be a valid URL.",
        });
      }
    }
    // Store the original URL; delivery transformation is applied at
    // render time (components) and in the response (toCoverImageUrl),
    // keeping the stored value consistent with the upload path.
  }

  // 5. Duplicate slug
  const duplicate = await slugExists(slug);
  if (duplicate) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 409 },
    );
  }

  // 6. Create post
  try {
    await insertPost({
      title: title.trim(),
      slug,
      category,
      content: content.trim(),
      excerpt: excerpt.length > 0 ? excerpt : undefined,
      coverImage: coverImageUrl ?? "",
      published,
    });
  } catch (error) {
    if (error instanceof PostConflictError) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }
    throw error;
  }

  // 7. Revalidate
  revalidatePostPages(slug);

  // 8. Return (CDN transform applied on response)
  const responseCoverImage = coverImageUrl
    ? (toCoverImageUrl(coverImageUrl) ?? coverImageUrl)
    : null;
  return NextResponse.json(
    {
      status: "created",
      slug,
      title: title.trim(),
      published,
      coverImage: responseCoverImage,
    },
    { status: 201 },
  );
}
