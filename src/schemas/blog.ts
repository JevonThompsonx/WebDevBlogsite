import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title is too long");
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only",
  );

export const basePostSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category is too long"),
  content: z.string().trim().min(1, "Content is required"),
  excerpt: z
    .string()
    .trim()
    .max(300, "Excerpt must be 300 characters or less")
    .optional(),
  coverImage: z
    .union([z.literal(""), z.string().url("Cover image must be a valid URL")])
    .optional(),
  published: z.boolean(),
});

export const createPostSchema = basePostSchema;

export const updatePostSchema = basePostSchema.extend({
  currentSlug: slugSchema,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
