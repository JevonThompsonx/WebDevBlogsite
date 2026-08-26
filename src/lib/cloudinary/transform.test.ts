import { describe, expect, it } from "vitest";
import {
  COVER_IMAGE_MAX_WIDTH,
  cdnImageUrl,
  coverImageUrl,
  isCloudinaryUrl,
} from "./transform";

describe("cdnImageUrl", () => {
  it("returns null for null input", () => {
    expect(cdnImageUrl(null)).toBeNull();
  });

  it("passes non-Cloudinary URLs through unchanged", () => {
    const url = "https://example.com/images/cover.jpg";
    expect(cdnImageUrl(url)).toBe(url);
  });

  it("inserts f_auto,q_auto after /upload/", () => {
    expect(
      cdnImageUrl(
        "https://res.cloudinary.com/demo/image/upload/v1690000000/webdevblogsite/covers/x.png",
      ),
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1690000000/webdevblogsite/covers/x.png",
    );
  });

  it("leaves already-transformed URLs untouched", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1690000000/webdevblogsite/covers/x.png";
    expect(cdnImageUrl(url)).toBe(url);
  });

  it("does not false-positive on public_id containing f_auto", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1690000000/webdevblogsite/covers/my_f_auto_image.png";
    expect(cdnImageUrl(url)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1690000000/webdevblogsite/covers/my_f_auto_image.png",
    );
  });

  it("does not false-positive on public_id containing q_auto", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1690000000/q_auto_cover.png";
    expect(cdnImageUrl(url)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1690000000/q_auto_cover.png",
    );
  });
});

describe("coverImageUrl", () => {
  it("returns null for null input", () => {
    expect(coverImageUrl(null)).toBeNull();
  });

  it("passes non-Cloudinary URLs through unchanged", () => {
    const url = "https://example.com/images/cover.jpg";
    expect(coverImageUrl(url)).toBe(url);
  });

  it("bounds delivery width in addition to format and quality", () => {
    expect(
      coverImageUrl(
        "https://res.cloudinary.com/demo/image/upload/v1690000000/webdevblogsite/covers/x.png",
      ),
    ).toBe(
      `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit/v1690000000/webdevblogsite/covers/x.png`,
    );
  });

  it("leaves already-bounded URLs untouched", () => {
    const url = `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit/v1690000000/webdevblogsite/covers/x.png`;
    expect(coverImageUrl(url)).toBe(url);
  });

  it("upgrades a format/quality-only chain with the width bound", () => {
    expect(
      coverImageUrl(
        "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1690000000/webdevblogsite/covers/x.png",
      ),
    ).toBe(
      `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit/v1690000000/webdevblogsite/covers/x.png`,
    );
  });

  it("does not false-positive on public_id containing c_limit", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1690000000/webdevblogsite/covers/c_limit_image.png";
    expect(coverImageUrl(url)).toBe(
      `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit/v1690000000/webdevblogsite/covers/c_limit_image.png`,
    );
  });

  it("does not false-positive on f_auto in public_id for coverImageUrl", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1690000000/my_f_auto_cover.png";
    expect(coverImageUrl(url)).toBe(
      `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit/v1690000000/my_f_auto_cover.png`,
    );
  });

  it("does not double-apply when already bounded via segment only", () => {
    const url = `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit/v1690000000/x.png`;
    expect(coverImageUrl(url)).toBe(url);
  });
});

describe("isCloudinaryUrl", () => {
  it("returns true for a Cloudinary URL", () => {
    expect(
      isCloudinaryUrl(
        "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      ),
    ).toBe(true);
  });

  it("returns false for a non-Cloudinary URL", () => {
    expect(isCloudinaryUrl("https://example.com/images/cover.jpg")).toBe(false);
  });

  it("returns false for evil.com path spoof", () => {
    expect(
      isCloudinaryUrl(
        "https://evil.com/res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      ),
    ).toBe(false);
  });

  it("returns false for malformed URL", () => {
    expect(isCloudinaryUrl("not a url")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isCloudinaryUrl(null)).toBe(false);
  });
});
