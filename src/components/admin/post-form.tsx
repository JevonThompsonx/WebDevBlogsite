"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import type { ActionState, PostRecord } from "@/types";
import { initialActionState } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SlugSync } from "@/components/admin/slug-sync";

interface PostFormProps {
  post?: PostRecord;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="mt-2 text-sm text-[#fda29b]">{error}</p>;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function PostForm({ post, action }: PostFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialActionState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <SlugSync
        initialSlug={post?.slug ?? ""}
        initialTitle={post?.title ?? ""}
        slugName="slug"
        titleName="title"
      />

      <div className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-6 md:grid-cols-2">
          <Field htmlFor="title" label="Title">
            <Input
              defaultValue={post?.title ?? ""}
              id="title"
              name="title"
              required
            />
            <FieldError error={state.fieldErrors.title} />
          </Field>

          <Field htmlFor="category" label="Category">
            <Input
              defaultValue={post?.category ?? ""}
              id="category"
              name="category"
              required
            />
            <FieldError error={state.fieldErrors.category} />
          </Field>
        </div>

        <Field htmlFor="slug" label="Slug">
          <Input
            defaultValue={post?.slug ?? ""}
            id="slug"
            name="slug"
            required
          />
          <FieldError error={state.fieldErrors.slug} />
        </Field>

        <Field htmlFor="content" label="Markdown content">
          <Textarea
            defaultValue={post?.content ?? ""}
            id="content"
            name="content"
            required
            rows={18}
          />
          <FieldError error={state.fieldErrors.content} />
        </Field>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
          <div className="space-y-5">
            <Field htmlFor="excerpt" label="Excerpt">
              <Textarea
                defaultValue={post?.excerpt ?? ""}
                id="excerpt"
                name="excerpt"
                rows={5}
              />
              <FieldError error={state.fieldErrors.excerpt} />
            </Field>

            <Field htmlFor="coverImage" label="Cover image URL">
              <Input
                defaultValue={post?.coverImage ?? ""}
                id="coverImage"
                name="coverImage"
              />
              <FieldError error={state.fieldErrors.coverImage} />
            </Field>

            <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-foreground)]">
              <input
                defaultChecked={post?.published ?? false}
                name="published"
                type="checkbox"
              />
              Publish this post
            </label>

            {post ? (
              <input name="currentSlug" type="hidden" value={post.slug} />
            ) : null}

            {state.status === "error" && state.message ? (
              <div className="rounded-2xl border border-[#fda29b]/40 bg-[#fef3f2]/10 px-4 py-3 text-sm text-[#fda29b]">
                {state.message}
              </div>
            ) : null}

            <Button className="w-full" disabled={pending} type="submit">
              {pending ? "Saving..." : post ? "Update post" : "Create post"}
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Markdown tips
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-foreground-soft)]">
            <li>Use `##` and `###` headings to build the table of contents.</li>
            <li>
              Code fences support highlighted languages like `ts`, `js`, `bash`,
              and `json`.
            </li>
            <li>
              Leave excerpt empty to auto-generate one from the post body.
            </li>
          </ul>
        </div>
      </div>
    </form>
  );
}
