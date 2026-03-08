import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
