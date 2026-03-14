import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_92%,white_8%),color-mix(in_srgb,var(--color-accent-strong)_88%,white_12%))] text-[var(--color-accent-foreground)] shadow-[0_18px_44px_color-mix(in_srgb,var(--color-accent)_28%,transparent)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_color-mix(in_srgb,var(--color-accent)_32%,transparent)]",
  secondary:
    "border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] text-[var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)] hover:shadow-[var(--shadow-lift)]",
  ghost:
    "border border-transparent text-[var(--color-muted)] hover:bg-[color-mix(in_srgb,var(--color-surface)_76%,white_24%)] hover:text-[var(--color-foreground)]",
  danger:
    "border border-transparent bg-[color-mix(in_srgb,#b42318_80%,black_20%)] text-white hover:-translate-y-0.5 hover:bg-[#b42318]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonClasses(variant, size), className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
