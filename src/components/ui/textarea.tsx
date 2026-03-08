import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full rounded-[1.6rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-accent)_24%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}
