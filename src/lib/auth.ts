import "server-only";

import { cache } from "react";
import type { Session } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { serverEnv } from "@/lib/env";

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

export const getCurrentSession = cache(
  async (): Promise<Session | null> => getServerSession(authOptions),
);

export async function isAdminSession(
  session: Session | null,
): Promise<boolean> {
  return Boolean(
    session?.user?.id && session.user.id === serverEnv.ADMIN_GITHUB_ID,
  );
}
