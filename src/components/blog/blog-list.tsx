import { BlogCard } from "@/components/blog/blog-card";
import type { PostRecord } from "@/types";

interface BlogListProps {
  posts: PostRecord[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] px-6 py-12 text-center text-[var(--color-muted)]">
        No published posts yet. The first article is coming soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
