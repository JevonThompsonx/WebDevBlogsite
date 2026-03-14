import Link from "next/link";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { siteConfig } from "@/lib/site";
import { AuthControls } from "@/components/layout/auth-controls";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const session = await getCurrentSession();
  const isAdmin = await isAdminSession(session);
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className="site-container">
        <div className="flex items-center justify-between gap-4 rounded-[1.8rem] border border-[color-mix(in_srgb,var(--color-border)_88%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_78%,transparent)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <Link
            className="group flex min-w-0 items-center gap-3 lg:justify-self-start"
            href="/"
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.08em] text-[var(--color-foreground)] uppercase">
                {siteConfig.name}
              </span>
              <span className="truncate text-xs text-[var(--color-muted)] transition group-hover:text-[var(--color-accent)]">
                Linux, self-hosting, and thoughtful delivery
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_78%,white_22%)] p-1 lg:flex lg:justify-self-center"
          >
            {navItems.map((item) => (
              <Link
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[color-mix(in_srgb,var(--color-surface)_54%,white_46%)] hover:text-[var(--color-foreground)]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex lg:justify-self-end">
            <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] px-3 py-2 xl:inline-flex">
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              <span className="text-xs font-medium text-[var(--color-foreground-soft)]">
                Available for systems work
              </span>
            </div>
            <ThemeToggle />
            <AuthControls isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <div className="relative">
              <MobileMenu
                isAdmin={isAdmin}
                isAuthenticated={isAuthenticated}
                items={navItems}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
