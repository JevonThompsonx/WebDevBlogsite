import type { NextAuthOptions } from "next-auth";
import NextAuthModule from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

type AuthContext = { params: Promise<{ nextauth: string[] }> };
type NextAuthHandler = (
  request: Request,
  context: AuthContext,
) => Promise<Response>;
type NextAuthFactory = (options: NextAuthOptions) => NextAuthHandler;

/**
 * next-auth v4 ships CommonJS. Depending on the bundler interop the default
 * import can be the NextAuth function, a namespace whose `.default` is the
 * function, or a nested CJS wrapper. Resolve all shapes so vinext/Vite and
 * Next.js behave the same.
 */
function resolveNextAuth(moduleValue: unknown): NextAuthFactory {
  const namespace = moduleValue as Record<string, unknown>;

  if (typeof moduleValue === "function") {
    return moduleValue as NextAuthFactory;
  }

  const first = namespace.default;
  if (typeof first === "function") {
    return first as NextAuthFactory;
  }

  const second = (first as Record<string, unknown> | undefined)?.default;
  if (typeof second === "function") {
    return second as NextAuthFactory;
  }

  const viaCjs = namespace["module.exports"];
  if (typeof viaCjs === "function") {
    return viaCjs as NextAuthFactory;
  }

  throw new Error("Unable to resolve the next-auth default export");
}

const handler = resolveNextAuth(NextAuthModule)(authOptions);

export const GET = handler;
export const POST = handler;
