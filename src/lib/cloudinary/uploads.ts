import "server-only";

import { createHash } from "node:crypto";
import { z } from "zod";

import { getCloudinaryConfig } from "@/lib/cloudinary/server";

export class CoverImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CoverImageValidationError";
  }
}

const uploadResponseSchema = z.object({
  secure_url: z.string().url(),
  public_id: z.string().optional(),
});

export const ALLOWED_COVER_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_COVER_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

function hasPngSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

function hasJpegSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  );
}

function hasGifSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 6) return false;
  const header = String.fromCharCode(...bytes.slice(0, 6));
  return header === "GIF87a" || header === "GIF89a";
}

function hasWebpSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  return riff === "RIFF" && webp === "WEBP";
}

function matchesImageSignature(type: string, bytes: Uint8Array): boolean {
  switch (type) {
    case "image/jpeg":
      return hasJpegSignature(bytes);
    case "image/png":
      return hasPngSignature(bytes);
    case "image/webp":
      return hasWebpSignature(bytes);
    case "image/gif":
      return hasGifSignature(bytes);
    default:
      return false;
  }
}

export async function validateCoverImage(file: File): Promise<void> {
  if (
    !ALLOWED_COVER_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_COVER_IMAGE_TYPES)[number],
    )
  ) {
    throw new CoverImageValidationError(
      "Only JPEG, PNG, WebP, or GIF images are allowed.",
    );
  }

  if (file.size > MAX_COVER_IMAGE_BYTES) {
    throw new CoverImageValidationError("Image must be under 10 MB.");
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesImageSignature(file.type, bytes)) {
    throw new CoverImageValidationError(
      "Uploaded file content does not match a supported image format.",
    );
  }
}

export async function uploadCoverImage(file: File): Promise<string> {
  const config = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "webdevblogsite/covers";

  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${config.apiSecret}`)
    .digest("hex");

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);
  uploadFormData.append("api_key", config.apiKey);
  uploadFormData.append("timestamp", String(timestamp));
  uploadFormData.append("folder", folder);
  uploadFormData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body: uploadFormData },
  );

  if (!response.ok) {
    let errorText = "";
    try {
      errorText =
        typeof response.text === "function" ? await response.text() : "";
    } catch {
      errorText = "";
    }
    console.error(
      `Cloudinary upload failed (status ${response.status}): ${errorText}`,
    );
    throw new Error("Image upload failed");
  }

  const payload = uploadResponseSchema.parse(await response.json());
  return payload.secure_url;
}
