import { revalidatePath } from "next/cache";

export function revalidatePostPages(slug: string, currentSlug?: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");

  if (slug.length > 0) {
    revalidatePath(`/blog/${slug}`);
  }

  if (currentSlug && currentSlug.length > 0 && currentSlug !== slug) {
    revalidatePath(`/blog/${currentSlug}`);
  }
}
