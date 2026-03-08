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

      {open ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.75rem)] mx-auto w-[min(92vw,28rem)] rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,white_8%)] p-5 shadow-[var(--shadow-soft)]">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[color-mix(in_srgb,var(--color-surface)_70%,white_30%)]"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-[var(--color-border)] pt-4">
            <AuthControls isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
