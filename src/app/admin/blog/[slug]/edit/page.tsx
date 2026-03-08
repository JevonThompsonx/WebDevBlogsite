import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { updatePostAction } from "@/server/actions/blog";
import { getPostBySlug } from "@/server/queries/posts";

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="space-y-3">
        <p className="section-eyebrow">Admin</p>
        <h1 className="section-title max-w-4xl">
          Edit post details and publishing status.
        </h1>
      </div>

      <PostForm action={updatePostAction} post={post} />
    </div>
  );
}
