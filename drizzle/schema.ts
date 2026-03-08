import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  coverImage: text("cover_image"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const postColumns = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  content: posts.content,
  excerpt: posts.excerpt,
  category: posts.category,
  coverImage: posts.coverImage,
  published: posts.published,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
};
