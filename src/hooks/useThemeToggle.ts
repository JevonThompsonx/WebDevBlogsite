"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const isDark = mounted ? resolvedTheme !== "light" : true;
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return { isDark, toggle };
}
