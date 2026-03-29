import { describe, expect, it } from "vitest";
import {
  isExternalHttpLink,
  isSafeLinkHref,
  isRelativePath,
  resolveSafeImageSource,
} from "@/lib/security";

describe("isRelativePath", () => {
  it("accepts common relative path forms", () => {
    expect(isRelativePath("/blog/post")).toBe(true);
    expect(isRelativePath("./local.png")).toBe(true);
    expect(isRelativePath("../asset.jpg")).toBe(true);
    expect(isRelativePath("#heading")).toBe(true);
    expect(isRelativePath("?view=full")).toBe(true);
  });

  it("rejects absolute URL strings", () => {
    expect(isRelativePath("https://example.com")).toBe(false);
  });
});

describe("isSafeLinkHref", () => {
  it("allows safe protocols and relative links", () => {
    expect(isSafeLinkHref("/blog/post")).toBe(true);
    expect(isSafeLinkHref("https://example.com")).toBe(true);
    expect(isSafeLinkHref("mailto:hello@example.com")).toBe(true);
  });

  it("rejects dangerous protocols", () => {
    expect(isSafeLinkHref("javascript:alert(1)")).toBe(false);
    expect(isSafeLinkHref("data:text/html;base64,abcd")).toBe(false);
  });
});

describe("isExternalHttpLink", () => {
  it("returns true only for absolute http/https links", () => {
    expect(isExternalHttpLink("https://example.com")).toBe(true);
    expect(isExternalHttpLink("http://example.com")).toBe(true);
    expect(isExternalHttpLink("/internal")).toBe(false);
    expect(isExternalHttpLink("mailto:hello@example.com")).toBe(false);
  });
});

describe("resolveSafeImageSource", () => {
  it("accepts relative paths and https URLs", () => {
    expect(resolveSafeImageSource("/images/post.webp")).toBe("/images/post.webp");
    expect(resolveSafeImageSource("https://images.example.com/post.webp")).toBe(
      "https://images.example.com/post.webp",
    );
  });

  it("rejects unsafe image protocols", () => {
    expect(resolveSafeImageSource("javascript:alert(1)")).toBeNull();
    expect(resolveSafeImageSource("http://example.com/post.webp")).toBeNull();
  });

  it("optionally allows localhost http for development", () => {
    expect(
      resolveSafeImageSource("http://localhost:3000/image.png", {
        allowInsecureLocalhost: true,
      }),
    ).toBe("http://localhost:3000/image.png");
    expect(
      resolveSafeImageSource("http://localhost:3000/image.png", {
        allowInsecureLocalhost: false,
      }),
    ).toBeNull();
  });
});
