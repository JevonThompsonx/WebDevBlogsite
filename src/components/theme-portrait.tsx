"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemePortraitProps {
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ThemePortrait({
  alt,
  className,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 22rem",
}: ThemePortraitProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isDark = mounted ? resolvedTheme !== "light" : true;
  const imageSrc = isDark
    ? "/images/Me-modified.webp"
    : "/images/Me-lightMode-modified.webp";

  const ringGradient = isDark
    ? "conic-gradient(from 210deg, #ffa3fd, #865dff 46%, transparent 46%)"
    : "conic-gradient(from 210deg, #92bfd9, #ccced3 46%, transparent 46%)";

  const glowColor = isDark
    ? "rgba(255, 143, 177, 0.22)"
    : "rgba(127, 181, 211, 0.24)";

  return (
    <div
      className={cn(
        "relative mx-auto w-full px-3 pb-4 pt-5 sm:px-4 sm:pb-5 sm:pt-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 inset-y-10 rounded-full blur-3xl sm:inset-x-10 sm:inset-y-12"
        style={{ background: glowColor }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-[17%] z-20 hidden whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-foreground-soft)] shadow-[var(--shadow-soft)] sm:inline-flex sm:animate-[float_9s_ease-in-out_infinite]"
      >
        linux + infra
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[15%] right-1 z-20 hidden whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-foreground-soft)] shadow-[var(--shadow-soft)] sm:inline-flex sm:animate-[float_10s_ease-in-out_infinite]"
      >
        docs + delivery
      </span>
      <div
        className="relative z-10 aspect-square rounded-full p-[3px] shadow-[var(--shadow-panel)]"
        style={{ backgroundImage: ringGradient }}
      >
        <div className="absolute inset-[8%] rounded-full border border-white/20" />
        <div className="flex h-full w-full items-end justify-center overflow-hidden rounded-full bg-transparent">
          <Image
            alt={alt}
            className="h-auto w-full object-contain object-bottom"
            height={900}
            priority={priority}
            sizes={sizes}
            src={imageSrc}
            width={900}
          />
        </div>
      </div>
    </div>
  );
}
