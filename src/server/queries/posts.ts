import "server-only";

import { and, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { postColumns, posts } from "../../../drizzle/schema";
import type { CreatePostInput, UpdatePostInput } from "@/schemas/blog";
import { truncate } from "@/lib/utils";
import type { PostRecord } from "@/types";

export class PostConflictError extends Error {
  constructor(message = "A post with this slug already exists.") {
    super(message);
    this.name = "PostConflictError";
  }
}

export class PostNotFoundError extends Error {
  constructor(message = "The requested post could not be found.") {
    super(message);
    this.name = "PostNotFoundError";
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /unique/i.test(error.message) &&
    /posts\.slug|slug/i.test(error.message)
  );
}

function createExcerpt(input: string): string {
  return truncate(
    input
      .replace(/[#_*`>\-[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    160,
  );
}

export async function getPublishedPosts(): Promise<PostRecord[]> {
  return db
    .select(postColumns)
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));
}

export async function getLatestPublishedPosts(
  limit: number,
): Promise<PostRecord[]> {
  return db
    .select(postColumns)
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function getAllPostsForAdmin(): Promise<PostRecord[]> {
  return db.select(postColumns).from(posts).orderBy(desc(posts.updatedAt));
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PostRecord | null> {
  const results = await db
    .select(postColumns)
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);

  return results[0] ?? null;
}

export async function getPostBySlug(slug: string): Promise<PostRecord | null> {
  const results = await db
    .select(postColumns)
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return results[0] ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const results = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));

  return results.map((post) => post.slug);
}

export async function getAdjacentPublishedPosts(slug: string): Promise<{
  previous: PostRecord | null;
  next: PostRecord | null;
}> {
  const currentPost = await getPublishedPostBySlug(slug);

  if (!currentPost) {
    return { previous: null, next: null };
  }

  const previousResults = await db
    .select(postColumns)
    .from(posts)
    .where(
      and(
        eq(posts.published, true),
        gt(posts.createdAt, currentPost.createdAt),
      ),
    )
    .orderBy(posts.createdAt)
    .limit(1);

  const nextResults = await db
    .select(postColumns)
    .from(posts)
    .where(
      and(
        eq(posts.published, true),
        lt(posts.createdAt, currentPost.createdAt),
      ),
    )
    .orderBy(desc(posts.createdAt))
    .limit(1);

  return {
    previous: previousResults[0] ?? null,
    next: nextResults[0] ?? null,
  };
}

export async function slugExists(
  slug: string,
  currentSlug?: string,
): Promise<boolean> {
  const record = await getPostBySlug(slug);

  if (!record) {
    return false;
  }

  if (currentSlug && record.slug === currentSlug) {
    return false;
  }

  return true;
}

export async function insertPost(input: CreatePostInput): Promise<void> {
  const now = new Date().toISOString();

  try {
    const inserted = await db
      .insert(posts)
      .values({
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt:
          input.excerpt && input.excerpt.length > 0
            ? truncate(input.excerpt, 300)
            : createExcerpt(input.content),
        category: input.category,
        coverImage:
          input.coverImage && input.coverImage.length > 0
            ? input.coverImage
            : null,
        published: input.published,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ slug: posts.slug });

    if (inserted.length === 0) {
      throw new Error("Post insert did not return a created row.");
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new PostConflictError();
    }

    throw error;
  }
}

export async function updatePostRecord(input: UpdatePostInput): Promise<void> {
  try {
    const updated = await db
      .update(posts)
      .set({
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt:
          input.excerpt && input.excerpt.length > 0
            ? truncate(input.excerpt, 300)
            : createExcerpt(input.content),
        category: input.category,
        coverImage:
          input.coverImage && input.coverImage.length > 0
            ? input.coverImage
            : null,
        published: input.published,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.slug, input.currentSlug))
      .returning({ slug: posts.slug });

    if (updated.length === 0) {
      throw new PostNotFoundError();
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new PostConflictError();
    }

    throw error;
  }
}

export async function deletePostRecord(slug: string): Promise<boolean> {
  const deleted = await db
    .delete(posts)
    .where(eq(posts.slug, slug))
    .returning({ slug: posts.slug });

  return deleted.length > 0;
}
