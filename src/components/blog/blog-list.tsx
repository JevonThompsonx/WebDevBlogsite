import { BlogCard } from "@/components/blog/blog-card";
import type { PostRecord } from "@/types";

interface BlogListProps {
  posts: PostRecord[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="surface-panel px-6 py-12 text-center">
        <p className="section-eyebrow mx-auto w-fit">Nothing published yet</p>
        <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-[var(--color-muted)]">
          No published posts yet. The first article is warming up behind the
          scenes.
        </p>
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
