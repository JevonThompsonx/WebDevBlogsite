import Link from "next/link";
import type { TableOfContentsItem } from "@/types";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="surface-panel p-5 lg:sticky lg:top-28">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
        On this page
      </p>
      <nav aria-label="Table of contents">
        <ul className="space-y-2 text-sm text-[var(--color-muted)]">
          {items.map((item) => (
            <li
              className={cn(item.level === 3 ? "pl-4" : "pl-0")}
              key={item.slug}
            >
              <Link
                className="block rounded-[1rem] px-3 py-2 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[color-mix(in_srgb,var(--color-surface)_76%,white_24%)] hover:text-[var(--color-foreground)]"
                href={`#${item.slug}`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
