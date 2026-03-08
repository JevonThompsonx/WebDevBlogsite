"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { createPostSchema, updatePostSchema } from "@/schemas/blog";
import {
  deletePostRecord,
  insertPost,
  slugExists,
  updatePostRecord,
} from "@/server/queries/posts";
import type { ActionState } from "@/types";

const unauthorizedMessage = "You are not authorized to manage posts.";

function invalidState(
  message: string,
  fieldErrors: Record<string, string> = {},
): ActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

async function requireAdmin(): Promise<void> {
  const session = await getCurrentSession();
  const isAdmin = await isAdminSession(session);

  if (!isAdmin) {
    throw new Error(unauthorizedMessage);
  }
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function buildFieldErrors(error: ZodError): Record<string, string> {
  const nextFieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key !== "string" || key in nextFieldErrors) {
      continue;
    }

    nextFieldErrors[key] = issue.message;
  }

  return nextFieldErrors;
}

function revalidatePostPages(slug: string, currentSlug?: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");

  if (slug.length > 0) {
    revalidatePath(`/blog/${slug}`);
  }

  if (currentSlug && currentSlug.length > 0 && currentSlug !== slug) {
    revalidatePath(`/blog/${currentSlug}`);
  }
}

export async function createPostAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch {
    return invalidState(unauthorizedMessage);
  }

  const parsed = createPostSchema.safeParse({
    title: readString(formData, "title"),
    slug: readString(formData, "slug"),
    category: readString(formData, "category"),
    content: readString(formData, "content"),
    excerpt: readString(formData, "excerpt"),
    coverImage: readString(formData, "coverImage"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return invalidState(
      "Please fix the highlighted fields.",
      buildFieldErrors(parsed.error),
    );
  }

  if (await slugExists(parsed.data.slug)) {
    return invalidState("Choose a different slug.", {
      slug: "That slug is already in use.",
    });
  }

  try {
    await insertPost(parsed.data);
  } catch {
    return invalidState("Something went wrong while saving the post.");
  }

  revalidatePostPages(parsed.data.slug);
  redirect("/admin");
}

export async function updatePostAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch {
    return invalidState(unauthorizedMessage);
  }

  const parsed = updatePostSchema.safeParse({
    currentSlug: readString(formData, "currentSlug"),
    title: readString(formData, "title"),
    slug: readString(formData, "slug"),
    category: readString(formData, "category"),
    content: readString(formData, "content"),
    excerpt: readString(formData, "excerpt"),
    coverImage: readString(formData, "coverImage"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return invalidState(
      "Please fix the highlighted fields.",
      buildFieldErrors(parsed.error),
    );
  }

  if (await slugExists(parsed.data.slug, parsed.data.currentSlug)) {
    return invalidState("Choose a different slug.", {
      slug: "That slug is already in use.",
    });
  }

  try {
    await updatePostRecord(parsed.data);
  } catch {
    return invalidState("Something went wrong while updating the post.");
  }

  revalidatePostPages(parsed.data.slug, parsed.data.currentSlug);
  redirect("/admin");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const slug = readString(formData, "slug");

  if (slug.length === 0) {
    return;
  }

  await deletePostRecord(slug);
  revalidatePostPages(slug);
}
