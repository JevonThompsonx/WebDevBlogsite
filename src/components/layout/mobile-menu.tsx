"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AuthControls } from "@/components/layout/auth-controls";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  items: NavItem[];
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function MobileMenu({
  items,
  isAuthenticated,
  isAdmin,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Button
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="h-11 w-11 rounded-full px-0"
          variant="secondary"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <>
          <button
            aria-label="Close navigation menu backdrop"
            className="fixed inset-0 z-40 bg-transparent lg:hidden"
            type="button"
            onClick={() => setOpen(false)}
          />

          <div className="fixed left-1/2 top-[5.25rem] z-50 w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 lg:hidden">
            <div className="max-h-[calc(100vh-6.25rem)] overflow-y-auto rounded-[2rem] border border-[color-mix(in_srgb,var(--color-border)_88%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_94%,white_6%),color-mix(in_srgb,var(--color-background-elevated)_90%,transparent))] p-5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between rounded-[1.4rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_76%,white_24%)] px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Navigation
                </span>
                <span className="text-xs text-[var(--color-foreground-soft)]">
                  Pick a lane
                </span>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-2"
              >
                {items.map((item) => (
                  <Link
                    className="rounded-[1.4rem] border border-transparent px-4 py-3 text-sm font-medium text-[var(--color-foreground)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--color-border)] hover:bg-[color-mix(in_srgb,var(--color-surface)_70%,white_30%)]"
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <AuthControls
                  isAdmin={isAdmin}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
