import { describe, expect, it, vi, beforeEach } from "vitest";
import { createPostAction, updatePostAction, deletePostAction } from "./blog";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  getCurrentSession: vi.fn(),
  isAdminSession: vi.fn(),
}));

vi.mock("@/server/queries/posts", () => ({
  slugExists: vi.fn(),
  insertPost: vi.fn(),
  updatePostRecord: vi.fn(),
  deletePostRecord: vi.fn(),
  PostConflictError: class PostConflictError extends Error {},
  PostNotFoundError: class PostNotFoundError extends Error {},
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Import mocked modules
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import {
  slugExists,
  insertPost,
  updatePostRecord,
  deletePostRecord,
} from "@/server/queries/posts";
import { redirect } from "next/navigation";

describe("createPostAction", () => {
  const initialState = { status: "idle" as const, message: "", fieldErrors: {} };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when user is not admin", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null);
    vi.mocked(isAdminSession).mockResolvedValue(false);

    const formData = new FormData();
    formData.set("title", "Test Post");
    formData.set("slug", "test-post");
    formData.set("category", "tech");
    formData.set("content", "Test content");

    const result = await createPostAction(initialState, formData);

    expect(result.status).toBe("error");
    expect(result.message).toBe("You are not authorized to manage posts.");
  });

  it("returns error when validation fails", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);

    const formData = new FormData();
    // Missing required fields

    const result = await createPostAction(initialState, formData);

    expect(result.status).toBe("error");
    expect(result.message).toBe("Please fix the highlighted fields.");
    expect(Object.keys(result.fieldErrors).length).toBeGreaterThan(0);
  });

  it("returns error when slug already exists", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);
    vi.mocked(slugExists).mockResolvedValue(true);

    const formData = new FormData();
    formData.set("title", "Test Post");
    formData.set("slug", "existing-slug");
    formData.set("category", "tech");
    formData.set("content", "Test content");

    const result = await createPostAction(initialState, formData);

    expect(result.status).toBe("error");
    expect(result.message).toBe("Choose a different slug.");
    expect(result.fieldErrors.slug).toBe("That slug is already in use.");
  });

  it("creates post and redirects on success", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(insertPost).mockResolvedValue(undefined);
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("Redirect");
    });

    const formData = new FormData();
    formData.set("title", "Test Post");
    formData.set("slug", "test-post");
    formData.set("category", "tech");
    formData.set("content", "Test content");
    formData.set("published", "on");

    await expect(createPostAction(initialState, formData)).rejects.toThrow("Redirect");
    expect(insertPost).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/admin");
  });
});

describe("updatePostAction", () => {
  const initialState = { status: "idle" as const, message: "", fieldErrors: {} };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when user is not admin", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null);
    vi.mocked(isAdminSession).mockResolvedValue(false);

    const formData = new FormData();
    formData.set("currentSlug", "old-slug");
    formData.set("title", "Updated Post");
    formData.set("slug", "updated-slug");
    formData.set("category", "tech");
    formData.set("content", "Updated content");

    const result = await updatePostAction(initialState, formData);

    expect(result.status).toBe("error");
    expect(result.message).toBe("You are not authorized to manage posts.");
  });

  it("returns error when validation fails", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);

    const formData = new FormData();
    // Missing required fields

    const result = await updatePostAction(initialState, formData);

    expect(result.status).toBe("error");
    expect(result.message).toBe("Please fix the highlighted fields.");
  });

  it("returns error when slug conflicts with another post", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);
    vi.mocked(slugExists).mockResolvedValue(true);

    const formData = new FormData();
    formData.set("currentSlug", "old-slug");
    formData.set("title", "Updated Post");
    formData.set("slug", "conflicting-slug");
    formData.set("category", "tech");
    formData.set("content", "Updated content");

    const result = await updatePostAction(initialState, formData);

    expect(result.status).toBe("error");
    expect(result.message).toBe("Choose a different slug.");
  });

  it("updates post and redirects on success", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);
    vi.mocked(slugExists).mockResolvedValue(false);
    vi.mocked(updatePostRecord).mockResolvedValue(undefined);
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("Redirect");
    });

    const formData = new FormData();
    formData.set("currentSlug", "old-slug");
    formData.set("title", "Updated Post");
    formData.set("slug", "updated-slug");
    formData.set("category", "tech");
    formData.set("content", "Updated content");
    formData.set("published", "on");

    await expect(updatePostAction(initialState, formData)).rejects.toThrow("Redirect");
    expect(updatePostRecord).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/admin");
  });
});

describe("deletePostAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error when user is not admin", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null);
    vi.mocked(isAdminSession).mockResolvedValue(false);

    const formData = new FormData();
    formData.set("slug", "test-post");

    await expect(deletePostAction(formData)).rejects.toThrow(
      "You are not authorized to manage posts."
    );
  });

  it("throws error when slug is invalid", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);

    const formData = new FormData();
    formData.set("slug", "Invalid Slug!");

    await expect(deletePostAction(formData)).rejects.toThrow("Invalid post slug.");
  });

  it("deletes post successfully", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);
    vi.mocked(deletePostRecord).mockResolvedValue(true);

    const formData = new FormData();
    formData.set("slug", "test-post");

    await deletePostAction(formData);

    expect(deletePostRecord).toHaveBeenCalledWith("test-post");
  });

  it("does not revalidate when post was not deleted", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "1" },
      expires: new Date().toISOString(),
    });
    vi.mocked(isAdminSession).mockResolvedValue(true);
    vi.mocked(deletePostRecord).mockResolvedValue(false);

    const formData = new FormData();
    formData.set("slug", "nonexistent-post");

    await deletePostAction(formData);

    expect(deletePostRecord).toHaveBeenCalledWith("nonexistent-post");
  });
});
