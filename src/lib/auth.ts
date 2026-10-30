import "server-only";

import { cache } from "react";
import type { Session } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GitHubProviderModule from "next-auth/providers/github";
import { serverEnv } from "@/lib/env";

// CJS/ESM interop: under Vite/vinext the provider can arrive wrapped in one or
// two `.default` layers. Resolve all shapes so Next.js and vinext agree.
const githubProviderCandidate = GitHubProviderModule as unknown as {
  default?: { default?: unknown } & unknown;
};
const GitHubProvider: typeof GitHubProviderModule =
  typeof GitHubProviderModule === "function"
    ? GitHubProviderModule
    : typeof githubProviderCandidate?.default === "function"
      ? (githubProviderCandidate.default as typeof GitHubProviderModule)
      : typeof githubProviderCandidate?.default?.default === "function"
        ? (githubProviderCandidate.default
            .default as typeof GitHubProviderModule)
        : GitHubProviderModule;

const sessionLifetimeSeconds = 60 * 60 * 12;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: sessionLifetimeSeconds,
  },
  jwt: {
    maxAge: sessionLifetimeSeconds,
  },
  secret: serverEnv.AUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: serverEnv.AUTH_GITHUB_ID,
      clientSecret: serverEnv.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      const providerAccountId = account?.providerAccountId;

      if (!providerAccountId) {
        return false;
      }

      return providerAccountId === serverEnv.ADMIN_GITHUB_ID;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const destination = new URL(url);

        if (destination.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
    async jwt({ token, account }) {
      const providerAccountId = account?.providerAccountId;

      if (providerAccountId) {
        token.sub = providerAccountId;
      }

      return token;
    },
    async session({ session, token }) {
      const existingUser = session.user ?? {
        name: null,
        email: null,
        image: null,
      };

      return {
        ...session,
        user: {
          ...existingUser,
          id: token.sub ?? "",
        },
      };
    },
  },
};

export const getCurrentSession = cache(async (): Promise<Session | null> =>
  getServerSession(authOptions),
);

export async function isAdminSession(
  session: Session | null,
): Promise<boolean> {
  return Boolean(
    session?.user?.id && session.user.id === serverEnv.ADMIN_GITHUB_ID,
  );
}
