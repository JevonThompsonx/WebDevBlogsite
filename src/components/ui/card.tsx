import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-[color-mix(in_srgb,var(--color-border)_88%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_92%,white_8%),color-mix(in_srgb,var(--color-background-elevated)_88%,transparent))] shadow-[var(--shadow-panel)] backdrop-blur transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
