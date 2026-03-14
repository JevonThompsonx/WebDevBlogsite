"use client";

import { useTransition } from "react";
import { LogIn, LogOut, Shield } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AuthControlsProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function AuthControls({ isAuthenticated, isAdmin }: AuthControlsProps) {
  const [pending, startTransition] = useTransition();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] px-4 text-sm font-medium text-[var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lift)]"
            href="/admin"
          >
            <Shield className="h-4 w-4" />
            Admin
          </a>
        ) : null}
        <Button
          disabled={pending}
          size="sm"
          variant="ghost"
          onClick={() => {
            startTransition(() => {
              void signOut({ callbackUrl: "/" });
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button
      disabled={pending}
      size="sm"
      variant="secondary"
      onClick={() => {
        startTransition(() => {
          void signIn("github", { callbackUrl: "/admin" });
        });
      }}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Admin sign in
    </Button>
  );
}
