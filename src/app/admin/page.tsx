import Link from "next/link";
import { PenSquare, PlusCircle } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getAllPostsForAdmin } from "@/server/queries/posts";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="section-eyebrow">Admin</p>
          <h1 className="section-title max-w-4xl">
            Manage posts, drafts, and publishing status.
          </h1>
        </div>
        <Link className={buttonClasses("primary", "md")} href="/admin/blog/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Updated</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  className="border-b border-[var(--color-border)]/70 last:border-b-0"
                  key={post.slug}
                >
                  <td className="px-6 py-5 align-top">
                    <div className="space-y-1">
                      <p className="font-medium text-[var(--color-foreground)]">
                        {post.title}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        /{post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <Badge>{post.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-6 py-5 align-top text-[var(--color-foreground-soft)]">
                    {post.category}
                  </td>
                  <td className="px-6 py-5 align-top text-[var(--color-foreground-soft)]">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        className={buttonClasses("secondary", "sm")}
                        href={`/admin/blog/${post.slug}/edit`}
                      >
                        <PenSquare className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteButton slug={post.slug} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
