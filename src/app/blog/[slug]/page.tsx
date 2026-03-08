import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PostContent } from "@/components/blog/post-content";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/metadata";
import { extractTableOfContents } from "@/lib/markdown";
import { estimateReadingTime, formatDate } from "@/lib/utils";
import {
  getAdjacentPublishedPosts,
  getPublishedPostBySlug,
} from "@/server/queries/posts";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Post Not Found | Jevon Thompson",
      description: "The requested article could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return buildMetadata({
    title: `${post.title} | Jevon Thompson`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage ?? "/images/mySite.webp",
  });
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [adjacentPosts] = await Promise.all([getAdjacentPublishedPosts(slug)]);
  const tableOfContents = extractTableOfContents(post.content);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8 lg:py-16">
      <article className="space-y-10">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
          href="/blog"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
            <Badge>{post.category}</Badge>
            <span>{formatDate(post.createdAt)}</span>
            <span>{estimateReadingTime(post.content)} min read</span>
          </div>

          <div className="space-y-4">
            <h1 className="section-title max-w-4xl text-[clamp(2.6rem,5vw,4.8rem)]">
              {post.title}
            </h1>
            <p className="section-copy">{post.excerpt}</p>
          </div>

          {post.coverImage ? (
            <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
              <Image
                alt={post.title}
                className="h-auto w-full object-cover"
                height={720}
                priority
                src={post.coverImage}
                width={1280}
              />
            </div>
          ) : null}
        </header>

        <PostContent markdown={post.content} />

        <nav
          aria-label="Post navigation"
          className="grid gap-4 border-t border-[var(--color-border)] pt-8 md:grid-cols-2"
        >
          {adjacentPosts.previous ? (
            <Link
              className="rounded-[1.5rem] border border-[var(--color-border)] p-5 transition hover:border-[var(--color-accent)]"
              href={`/blog/${adjacentPosts.previous.slug}`}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Previous post
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-foreground)]">
                {adjacentPosts.previous.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {adjacentPosts.next ? (
            <Link
              className="rounded-[1.5rem] border border-[var(--color-border)] p-5 text-right transition hover:border-[var(--color-accent)]"
              href={`/blog/${adjacentPosts.next.slug}`}
            >
              <p className="inline-flex items-center justify-end gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Next post
                <ArrowRight className="h-4 w-4" />
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-foreground)]">
                {adjacentPosts.next.title}
              </p>
            </Link>
          ) : null}
        </nav>
      </article>

      <div className="lg:pt-28">
        <TableOfContents items={tableOfContents} />
      </div>
    </div>
  );
}
