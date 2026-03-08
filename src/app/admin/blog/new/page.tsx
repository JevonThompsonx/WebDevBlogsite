import { PostForm } from "@/components/admin/post-form";
import { createPostAction } from "@/server/actions/blog";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="space-y-3">
        <p className="section-eyebrow">Admin</p>
        <h1 className="section-title max-w-4xl">Create a new blog post.</h1>
      </div>

      <PostForm action={createPostAction} />
    </div>
  );
}
