import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { estimateReadingTime, formatDate } from "@/lib/utils";
import type { PostRecord } from "@/types";

interface BlogCardProps {
  post: PostRecord;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link className="block h-full" href={`/blog/${post.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-[color-mix(in_srgb,var(--color-surface)_75%,black_25%)]">
          {post.coverImage ? (
            <Image
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={post.coverImage}
            />
          ) : (
            <div className="flex h-full items-end bg-[radial-gradient(circle_at_top,rgba(237,117,74,0.22),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))] p-6">
              <span className="max-w-xs font-[family-name:var(--font-display)] text-2xl text-white/90">
                {post.title}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
            <Badge>{post.category}</Badge>
            <span>{formatDate(post.createdAt)}</span>
            <span>{estimateReadingTime(post.content)} min read</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--color-foreground)]">
              {post.title}
            </h3>
            <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
              {post.excerpt}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]">
            Read article
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
