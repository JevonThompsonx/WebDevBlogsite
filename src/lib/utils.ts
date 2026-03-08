import { format } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function estimateReadingTime(markdown: string): number {
  const plainText = markdown.replace(/[#_*`>[\]-]/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;

  if (words === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}
