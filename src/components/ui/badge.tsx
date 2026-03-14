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
        "inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--color-border)_92%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_78%,white_22%)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
