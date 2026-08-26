import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ALLOWED_COVER_IMAGE_TYPES,
  CoverImageValidationError,
  MAX_COVER_IMAGE_BYTES,
  uploadCoverImage,
  validateCoverImage,
} from "./uploads";

const PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x01,
]);
const JPEG_BYTES = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00]);
const GIF_BYTES = Uint8Array.from(
  Array.from(new TextEncoder().encode("GIF89a")).concat([0x00]),
);
const WEBP_BYTES = Uint8Array.from([
  ...new TextEncoder().encode("RIFF"),
  0x00,
  0x00,
  0x00,
  0x00,
  ...new TextEncoder().encode("WEBP"),
]);

function makeFile(bytes: BlobPart, type: string, name = "cover"): File {
  return new File([bytes], name, { type });
}

describe("validateCoverImage", () => {
  it.each([
    ["image/jpeg", JPEG_BYTES],
    ["image/png", PNG_BYTES],
    ["image/gif", GIF_BYTES],
    ["image/webp", WEBP_BYTES],
  ])("accepts a valid %s file", async (type, bytes) => {
    await expect(
      validateCoverImage(makeFile(bytes, type)),
    ).resolves.toBeUndefined();
  });

  it("rejects unsupported declared types", async () => {
    await expect(
      validateCoverImage(makeFile(PNG_BYTES, "application/pdf")),
    ).rejects.toBeInstanceOf(CoverImageValidationError);
  });

  it("rejects files whose content does not match the declared type", async () => {
    await expect(
      validateCoverImage(makeFile(JPEG_BYTES, "image/png")),
    ).rejects.toBeInstanceOf(CoverImageValidationError);
  });

  it("rejects truncated files that cannot match any signature", async () => {
    await expect(
      validateCoverImage(makeFile(Uint8Array.from([0x00]), "image/png")),
    ).rejects.toBeInstanceOf(CoverImageValidationError);
  });

  it("rejects files larger than the maximum size", async () => {
    const oversized = new File(
      [new ArrayBuffer(MAX_COVER_IMAGE_BYTES + 1)],
      "big.png",
      { type: "image/png" },
    );

    await expect(validateCoverImage(oversized)).rejects.toThrowError(/10 MB/);
  });

  it("exports the documented policy constants", () => {
    expect(MAX_COVER_IMAGE_BYTES).toBe(10 * 1024 * 1024);
    expect(ALLOWED_COVER_IMAGE_TYPES).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
  });

  it("reads only first 12 bytes for signature validation", async () => {
    const file = makeFile(PNG_BYTES, "image/png");
    const sliceSpy = vi.spyOn(file, "slice");
    await expect(validateCoverImage(file)).resolves.toBeUndefined();
    expect(sliceSpy).toHaveBeenCalledWith(0, 12);
    sliceSpy.mockRestore();
  });

  it("checks size before reading file content for oversized files", async () => {
    const oversized = new File(
      [new ArrayBuffer(MAX_COVER_IMAGE_BYTES + 1)],
      "big.png",
      { type: "image/png" },
    );
    const sliceSpy = vi.spyOn(oversized, "slice");
    await expect(validateCoverImage(oversized)).rejects.toThrowError(/10 MB/);
    expect(sliceSpy).not.toHaveBeenCalled();
    sliceSpy.mockRestore();
  });

  it("logs generic error on upload failure without leaking Cloudinary text", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMockLocal = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "secret cloudinary error with api key leak",
    });
    vi.stubGlobal("fetch", fetchMockLocal);
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "test-cloud");
    vi.stubEnv("CLOUDINARY_API_KEY", "test-key");
    vi.stubEnv("CLOUDINARY_API_SECRET", "test-secret");

    await expect(
      uploadCoverImage(makeFile(PNG_BYTES, "image/png")),
    ).rejects.toThrowError("Image upload failed");
    // should not leak secret text in thrown error
    try {
      await uploadCoverImage(makeFile(PNG_BYTES, "image/png"));
    } catch (e) {
      expect((e as Error).message).not.toContain("secret");
      expect((e as Error).message).toBe("Image upload failed");
    }
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});

describe("uploadCoverImage", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "test-cloud");
    vi.stubEnv("CLOUDINARY_API_KEY", "test-key");
    vi.stubEnv("CLOUDINARY_API_SECRET", "test-secret");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        secure_url:
          "https://res.cloudinary.com/test-cloud/image/upload/v1/webdevblogsite/covers/cover.png",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("uploads with signed params and returns the secure URL", async () => {
    const url = await uploadCoverImage(makeFile(PNG_BYTES, "image/png"));

    expect(url).toBe(
      "https://res.cloudinary.com/test-cloud/image/upload/v1/webdevblogsite/covers/cover.png",
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [endpoint, init] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(endpoint).toBe(
      "https://api.cloudinary.com/v1_1/test-cloud/image/upload",
    );
    expect(init.method).toBe("POST");

    const formData = init.body as FormData;
    expect(formData.get("api_key")).toBe("test-key");
    expect(formData.get("folder")).toBe("webdevblogsite/covers");
    expect(String(formData.get("timestamp"))).toMatch(/^\d+$/);
    expect(String(formData.get("signature"))).toMatch(/^[a-f0-9]{40}$/);
    expect(formData.get("file")).toBeInstanceOf(File);
  });

  it("throws when Cloudinary responds with an error status", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 });

    await expect(
      uploadCoverImage(makeFile(PNG_BYTES, "image/png")),
    ).rejects.toThrowError(/Image upload failed/);
  });

  it("throws when credentials are not configured", async () => {
    vi.stubEnv("CLOUDINARY_API_KEY", "");

    await expect(
      uploadCoverImage(makeFile(PNG_BYTES, "image/png")),
    ).rejects.toThrowError(/not configured/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
