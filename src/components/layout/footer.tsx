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
    <footer className="pb-8 pt-16 sm:pt-20">
      <div className="site-container">
        <div className="surface-panel flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="section-eyebrow">Stay in touch</p>
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,3vw,3rem)] leading-[0.96] text-[var(--color-foreground)]">
                Building sturdy systems, then writing down what mattered.
              </p>
              <p className="max-w-xl text-base leading-8 text-[var(--color-foreground-soft)]">
                If you want help with infrastructure, delivery, or cleaning up a
                messy technical story, send a note and I will gladly dig in.
              </p>
            </div>
            <a className="section-link" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Around the site
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
              {footerLinks.map((item) => {
                const isExternal = item.href.startsWith("http");

                if (isExternal) {
                  return (
                    <a
                      className="rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] px-4 py-2 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
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
                    className="rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] px-4 py-2 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Built with Next.js, a steady feedback loop, and a little homelab
              curiosity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
