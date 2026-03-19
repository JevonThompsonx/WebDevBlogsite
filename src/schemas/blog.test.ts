import { describe, expect, it } from "vitest";
import { createPostSchema, updatePostSchema } from "@/schemas/blog";

describe("createPostSchema", () => {
  it("accepts a valid post payload", () => {
    const result = createPostSchema.safeParse({
      title: "My First Post",
      slug: "my-first-post",
      category: "Systems",
      content: "Some content here.",
      excerpt: "A short description.",
      published: false,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createPostSchema.safeParse({
      title: "",
      slug: "valid-slug",
      category: "Systems",
      content: "Content",
      published: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid slug with spaces", () => {
    const result = createPostSchema.safeParse({
      title: "Title",
      slug: "invalid slug",
      category: "Systems",
      content: "Content",
      published: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid slug with uppercase letters", () => {
    const result = createPostSchema.safeParse({
      title: "Title",
      slug: "InvalidSlug",
      category: "Systems",
      content: "Content",
      published: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid cover image URL", () => {
    const result = createPostSchema.safeParse({
      title: "Title",
      slug: "valid-slug",
      category: "Systems",
      content: "Content",
      coverImage: "not-a-url",
      published: false,
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty string for coverImage (no image)", () => {
    const result = createPostSchema.safeParse({
      title: "Title",
      slug: "valid-slug",
      category: "Systems",
      content: "Content",
      coverImage: "",
      published: false,
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid HTTPS cover image URL", () => {
    const result = createPostSchema.safeParse({
      title: "Title",
      slug: "valid-slug",
      category: "Systems",
      content: "Content",
      coverImage: "https://example.com/image.jpg",
      published: true,
    });

    expect(result.success).toBe(true);
  });
});

describe("updatePostSchema", () => {
  it("requires currentSlug in addition to base fields", () => {
    const withoutCurrent = updatePostSchema.safeParse({
      title: "Title",
      slug: "valid-slug",
      category: "Systems",
      content: "Content",
      published: false,
    });

    expect(withoutCurrent.success).toBe(false);
  });

  it("accepts a valid update payload", () => {
    const result = updatePostSchema.safeParse({
      currentSlug: "old-slug",
      title: "Updated Title",
      slug: "updated-slug",
      category: "Systems",
      content: "Updated content.",
      published: true,
    });

    expect(result.success).toBe(true);
  });
});
