import "server-only";

import { cache } from "react";
import type { Session } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { serverEnv } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
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
