import { NotebookPen, SearchCheck } from "lucide-react";
import { BlogList } from "@/components/blog/blog-list";
import { buildMetadata } from "@/lib/metadata";
import { getPublishedPosts } from "@/server/queries/posts";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Blog | Jevon Thompson",
  description:
    "Technical writing, project notes, and lessons from building practical systems and web experiences.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="site-container flex w-full flex-col gap-12 py-8 pb-16 sm:py-10 lg:gap-14 lg:pb-20">
      <section className="surface-panel grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:px-10">
        <div className="space-y-5">
          <p className="section-eyebrow">Blog</p>
          <h1 className="section-title max-w-4xl">
            Writing about systems, shipping, and the little decisions that shape
            trust.
          </h1>
          <p className="section-copy">
            Published notes on technical growth, operating reliable systems, and
            what I learn while building software that needs to hold up over
            time.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="surface-tile p-5">
            <NotebookPen className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-foreground)]">
              {posts.length}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-foreground-soft)]">
              Published pieces with practical context instead of vague
              takeaways.
            </p>
          </div>
          <div className="surface-tile p-5">
            <SearchCheck className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="mt-4 text-sm leading-7 text-[var(--color-foreground-soft)]">
              Expect writeups on homelab work, frontend details, debugging, and
              the tradeoffs that only appear after real implementation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="text-sm text-[var(--color-muted)]">
          Read in any order, but the most recent posts are usually the clearest
          snapshot of what I am learning right now.
        </p>
      </section>

      <BlogList posts={posts} />
    </div>
  );
}
