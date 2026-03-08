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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="space-y-5">
        <p className="section-eyebrow">Blog</p>
        <h1 className="section-title max-w-4xl">
          Writing about systems, shipping, and the small details that matter.
        </h1>
        <p className="section-copy">
          Published notes on development, technical growth, and the thinking
          behind the projects I choose to build.
        </p>
      </section>

      <BlogList posts={posts} />
    </div>
  );
}
