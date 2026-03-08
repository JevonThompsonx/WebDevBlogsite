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

  return (
    <div className={cn("relative mx-auto w-full", className)}>
      <div
        className="relative aspect-square rounded-full p-[3px]"
        style={{ backgroundImage: ringGradient }}
      >
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
