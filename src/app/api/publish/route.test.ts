import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/queries/posts", () => ({
  slugExists: vi.fn(),
  insertPost: vi.fn(),
  PostConflictError: class PostConflictError extends Error {
    constructor(message = "A post with this slug already exists.") {
      super(message);
      this.name = "PostConflictError";
    }
  },
}));

vi.mock("@/lib/revalidation", () => ({
  revalidatePostPages: vi.fn(),
}));

vi.mock("@/lib/cloudinary/server", () => ({
  getCloudinaryConfig: vi.fn(() => ({
    cloudName: "test-cloud",
    apiKey: "test-key",
    apiSecret: "test-secret",
  })),
}));

vi.mock("@/lib/cloudinary/uploads", () => ({
  CoverImageValidationError: class CoverImageValidationError extends Error {},
  validateCoverImage: vi.fn(),
  uploadCoverImage: vi.fn(),
}));

import { POST } from "./route";
import { revalidatePostPages } from "@/lib/revalidation";
import {
  insertPost,
  PostConflictError,
  slugExists,
} from "@/server/queries/posts";
import {
  CoverImageValidationError,
  uploadCoverImage,
  validateCoverImage,
} from "@/lib/cloudinary/uploads";

const PUBLISH_TOKEN = "test-publish-token";
const UPLOADED_URL =
  "https://res.cloudinary.com/test-cloud/image/upload/v1/webdevblogsite/covers/cover.png";

function jsonRequest(body: unknown, token: string | null = PUBLISH_TOKEN) {
  return new Request("http://localhost/api/publish", {
    method: "POST",
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function multipartRequest(
  buildForm: (form: FormData) => void,
  token: string | null = PUBLISH_TOKEN,
) {
  const form = new FormData();
  buildForm(form);

  return new Request("http://localhost/api/publish", {
    method: "POST",
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body: form,
  });
}

describe("POST /api/publish auth", () => {
  const validBody = { title: "Hello World", content: "# Hi" };

  it("returns 401 when the Authorization header is missing", async () => {
    const response = await POST(jsonRequest(validBody, null));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 for a wrong token", async () => {
    const response = await POST(jsonRequest(validBody, "wrong-token"));
    expect(response.status).toBe(401);
  });

  it("returns 401 when PUBLISH_TOKEN is not configured", async () => {
    vi.stubEnv("PUBLISH_TOKEN", "");
    const response = await POST(jsonRequest(validBody, PUBLISH_TOKEN));
    expect(response.status).toBe(401);
  });
});

describe("POST /api/publish creation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates a post and applies defaults", async () => {
    const response = await POST(
      jsonRequest({ title: "Hello Wide World!", content: "Body text" }),
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      status: "created",
      slug: "hello-wide-world",
      title: "Hello Wide World!",
      published: true,
      coverImage: null,
    });

    expect(vi.mocked(insertPost)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(insertPost)).toHaveBeenCalledWith({
      title: "Hello Wide World!",
      slug: "hello-wide-world",
      category: "Technical",
      content: "Body text",
      excerpt: undefined,
      coverImage: "",
      published: true,
    });
    expect(vi.mocked(revalidatePostPages)).toHaveBeenCalledWith(
      "hello-wide-world",
    );
  });

  it("honors explicit slug, category, excerpt, and draft flag", async () => {
    const response = await POST(
      jsonRequest({
        title: "Custom",
        content: "Body",
        slug: "custom-slug",
        category: "Life",
        excerpt: "Hand written",
        published: false,
      }),
    );

    expect(response.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith({
      title: "Custom",
      slug: "custom-slug",
      category: "Life",
      content: "Body",
      excerpt: "Hand written",
      coverImage: "",
      published: false,
    });
  });

  it("accepts a multipart payload with a boolean-style published field", async () => {
    const response = await POST(
      multipartRequest((form) => {
        form.set("title", "Form Post");
        form.set("content", "Body");
        form.set("published", "false");
      }),
    );

    expect(response.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({ published: false, slug: "form-post" }),
    );
  });

  it("uploads an attached cover image and returns an optimized URL", async () => {
    vi.mocked(validateCoverImage).mockResolvedValue(undefined);
    vi.mocked(uploadCoverImage).mockResolvedValue(UPLOADED_URL);

    const png = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);

    const response = await POST(
      multipartRequest((form) => {
        form.set("title", "With Cover");
        form.set("content", "Body");
        form.set(
          "coverImage",
          new File([png], "cover.png", { type: "image/png" }),
        );
      }),
    );

    expect(response.status).toBe(201);
    expect(vi.mocked(validateCoverImage)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(uploadCoverImage)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({ coverImage: UPLOADED_URL }),
    );
    expect((await response.json()).coverImage).toBe(
      UPLOADED_URL.replace("/upload/", "/upload/f_auto,q_auto,w_1280,c_limit/"),
    );
  });

  it("rejects invalid cover images with a 400", async () => {
    vi.mocked(validateCoverImage).mockRejectedValue(
      new CoverImageValidationError(
        "Only JPEG, PNG, WebP, or GIF images are allowed.",
      ),
    );

    const response = await POST(
      multipartRequest((form) => {
        form.set("title", "Bad Cover");
        form.set("content", "Body");
        form.set(
          "coverImage",
          new File([Uint8Array.from([0x00])], "evil.png", {
            type: "image/png",
          }),
        );
      }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details.coverImage).toMatch(/JPEG, PNG, WebP/);
    expect(vi.mocked(uploadCoverImage)).not.toHaveBeenCalled();
    expect(vi.mocked(insertPost)).not.toHaveBeenCalled();
  });

  it("maps a duplicate slug to 409 via slugExists", async () => {
    vi.mocked(slugExists).mockResolvedValue(true);

    const response = await POST(
      jsonRequest({ title: "Dup", content: "Body", slug: "taken" }),
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "A post with this slug already exists",
    });
    expect(vi.mocked(insertPost)).not.toHaveBeenCalled();
  });

  it("maps a unique-constraint race to 409", async () => {
    vi.mocked(insertPost).mockRejectedValue(new PostConflictError());

    const response = await POST(
      jsonRequest({ title: "Race", content: "Body" }),
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "A post with this slug already exists",
    });
  });

  it("returns 400 with field details on validation failure", async () => {
    const response = await POST(jsonRequest({ title: "", content: "" }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(Object.keys(body.details)).toContain("title");
    expect(Object.keys(body.details)).toContain("content");
  });

  it("returns 400 when the slug cannot be derived from the title", async () => {
    const response = await POST(
      jsonRequest({ title: "???!!!", content: "Body" }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.slug).toBeDefined();
  });

  it("returns 400 for malformed JSON bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/publish", {
        method: "POST",
        headers: {
          authorization: `Bearer ${PUBLISH_TOKEN}`,
          "content-type": "application/json",
        },
        body: "not-json",
      }),
    );

    expect(response.status).toBe(400);
  });

  it("treats an empty-string coverImage as no image", async () => {
    const response = await POST(
      jsonRequest({ title: "No Image", content: "Body", coverImage: "" }),
    );

    expect(response.status).toBe(201);
    expect((await response.json()).coverImage).toBeNull();
    expect(vi.mocked(uploadCoverImage)).not.toHaveBeenCalled();
  });
});

describe("POST /api/publish C1 content-length guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("returns 413 when Content-Length exceeds 11MB for JSON", async () => {
    const req = new Request("http://localhost/api/publish", {
      method: "POST",
      headers: {
        authorization: `Bearer ${PUBLISH_TOKEN}`,
        "content-type": "application/json",
        "content-length": String(11 * 1024 * 1024 + 1),
      },
      body: JSON.stringify({ title: "Big", content: "Body" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "Payload too large" });
  });

  it("returns 413 when Content-Length exceeds 11MB for multipart", async () => {
    const form = new FormData();
    form.set("title", "Big");
    form.set("content", "Body");
    const req = new Request("http://localhost/api/publish", {
      method: "POST",
      headers: {
        authorization: `Bearer ${PUBLISH_TOKEN}`,
        "content-length": String(12 * 1024 * 1024),
      },
      body: form,
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("allows request when Content-Length header absent (enforces post-parse size)", async () => {
    const res = await POST(
      jsonRequest({ title: "No header", content: "Body" }),
    );
    expect(res.status).toBe(201);
  });
});

describe("POST /api/publish C2 invalid multipart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("returns 400 Invalid multipart body when formData throws", async () => {
    const req = new Request("http://localhost/api/publish", {
      method: "POST",
      headers: {
        authorization: `Bearer ${PUBLISH_TOKEN}`,
        "content-type": "multipart/form-data; boundary=----invalid",
      },
      body: "not-a-valid-multipart-body-%%%",
    });
    // Node's formData may not throw for simple string; we also test via mocked throw path
    // Force formData to throw by stubbing Request prototype
    const originalFormData = req.formData;
    (req as unknown as { formData: () => Promise<FormData> }).formData = () =>
      Promise.reject(new Error("parse error"));
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid multipart body" });
    req.formData = originalFormData;
  });
});

describe("POST /api/publish H1 published boolean handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
  });
  afterEach(() => vi.unstubAllEnvs());

  it('rejects string "false" for published in JSON', async () => {
    const res = await POST(
      jsonRequest({
        title: "H1",
        content: "Body",
        published: "false" as unknown as boolean,
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details.published).toBeDefined();
  });

  it("rejects numeric published in JSON", async () => {
    const res = await POST(
      jsonRequest({
        title: "H1",
        content: "Body",
        published: 1 as unknown as boolean,
      }),
    );
    expect(res.status).toBe(400);
  });

  it("accepts boolean false in JSON", async () => {
    const res = await POST(
      jsonRequest({ title: "H1b", content: "Body", published: false }),
    );
    expect(res.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({ published: false }),
    );
  });

  it("accepts boolean true in JSON", async () => {
    const res = await POST(
      jsonRequest({ title: "H1c", content: "Body", published: true }),
    );
    expect(res.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({ published: true }),
    );
  });

  it("defaults to true when published omitted", async () => {
    const res = await POST(jsonRequest({ title: "H1d", content: "Body" }));
    expect(res.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({ published: true }),
    );
  });
});

describe("POST /api/publish H2 coverImage host validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("rejects coverImage with non-cloudinary host", async () => {
    const res = await POST(
      jsonRequest({
        title: "H2",
        content: "Body",
        coverImage: "https://evil.com/image.jpg",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.details.coverImage).toMatch(/host not allowed/i);
  });

  it("rejects coverImage with non-cloudinary host case-insensitive", async () => {
    const res = await POST(
      jsonRequest({
        title: "H2b",
        content: "Body",
        coverImage: "https://EVIL.COM/image.jpg",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("allows res.cloudinary.com host (case-insensitive)", async () => {
    const res = await POST(
      jsonRequest({
        title: "H2c",
        content: "Body",
        coverImage:
          "https://RES.CLOUDINARY.COM/test-cloud/image/upload/v1/x.png",
      }),
    );
    expect(res.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({
        coverImage:
          "https://RES.CLOUDINARY.COM/test-cloud/image/upload/v1/x.png",
      }),
    );
  });

  it("allows local /images/ paths", async () => {
    const res = await POST(
      jsonRequest({
        title: "H2d",
        content: "Body",
        coverImage: "/images/local.jpg",
      }),
    );
    expect(res.status).toBe(201);
    expect(vi.mocked(insertPost)).toHaveBeenLastCalledWith(
      expect.objectContaining({ coverImage: "/images/local.jpg" }),
    );
  });

  it("rejects non-http protocol", async () => {
    const res = await POST(
      jsonRequest({
        title: "H2e",
        content: "Body",
        coverImage: "ftp://res.cloudinary.com/x.png",
      }),
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/publish H4 generic upload error", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
    vi.mocked(validateCoverImage).mockResolvedValue(undefined);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns generic 502 without leaking Cloudinary text", async () => {
    const secret = "secret-leaked-token 12345";
    vi.mocked(uploadCoverImage).mockRejectedValue(
      new Error(`Cloudinary upload failed (status 500): ${secret}`),
    );
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const png = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const res = await POST(
      multipartRequest((form) => {
        form.set("title", "H4");
        form.set("content", "Body");
        form.set(
          "coverImage",
          new File([png], "cover.png", { type: "image/png" }),
        );
      }),
    );
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({ error: "Image upload failed" });
    expect(JSON.stringify(body)).not.toContain(secret);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("POST /api/publish L1 timingSafeEqual via hash", () => {
  it("rejects token with different length", async () => {
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    const res = await POST(
      jsonRequest({ title: "L1", content: "Body" }, "short"),
    );
    expect(res.status).toBe(401);
    vi.unstubAllEnvs();
  });

  it("rejects token with same length but wrong content", async () => {
    vi.stubEnv("PUBLISH_TOKEN", PUBLISH_TOKEN);
    const wrongSameLength = "a".repeat(PUBLISH_TOKEN.length);
    const res = await POST(
      jsonRequest({ title: "L1b", content: "Body" }, wrongSameLength),
    );
    expect(res.status).toBe(401);
    vi.unstubAllEnvs();
  });
});
