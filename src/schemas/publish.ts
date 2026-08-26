import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const publishPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  content: z.string().trim().min(1, "Content is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only")
    .optional(),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category is too long")
    .optional(),
  excerpt: z
    .string()
    .trim()
    .max(300, "Excerpt must be 300 characters or less")
    .optional(),
  coverImage: z
    .union([
      z.literal(""),
      z.string().url("Cover image must be a valid URL"),
      z.string().regex(/^\/images\/.+/, "Cover image must be a valid URL"),
    ])
    .optional(),
  published: z.boolean().optional(),
});

export type PublishPostInput = z.infer<typeof publishPostSchema>;
