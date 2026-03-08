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
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_76%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="group flex min-w-0 flex-col" href="/">
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.08em] text-[var(--color-foreground)] uppercase">
            {siteConfig.name}
          </span>
          <span className="text-xs text-[var(--color-muted)] transition group-hover:text-[var(--color-accent)]">
            Systems, code, and thoughtful delivery
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
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
    </header>
  );
}
