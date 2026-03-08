import Link from "next/link";
import { siteConfig } from "@/lib/site";

const footerLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: siteConfig.github, label: "GitHub" },
  { href: siteConfig.linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-2xl space-y-2">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
            Building reliable experiences with personality.
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Reach me at{" "}
            <a
              className="text-[var(--color-accent)]"
              href={`mailto:${siteConfig.email}`}
            >
              {siteConfig.email}
            </a>
            .
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
          {footerLinks.map((item) => {
            const isExternal = item.href.startsWith("http");

            if (isExternal) {
              return (
                <a
                  className="transition hover:text-[var(--color-foreground)]"
                  href={item.href}
                  key={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                className="transition hover:text-[var(--color-foreground)]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
