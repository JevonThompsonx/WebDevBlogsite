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
    <aside className="rounded-[1.75rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-28">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
        On this page
      </p>
      <nav aria-label="Table of contents">
        <ul className="space-y-3 text-sm text-[var(--color-muted)]">
          {items.map((item) => (
            <li
              className={cn(item.level === 3 ? "pl-4" : "pl-0")}
              key={item.slug}
            >
              <Link
                className="transition hover:text-[var(--color-foreground)]"
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
