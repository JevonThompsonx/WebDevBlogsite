import { z } from "zod";

const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.TURSO_DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING
  );
}

function resolveDatabaseAuthToken(): string | undefined {
  return (
    process.env.DATABASE_AUTH_TOKEN ??
    process.env.TURSO_AUTH_TOKEN ??
    process.env.POSTGRES_PASSWORD
  );
}

const serverSchema = z.object({
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_GITHUB_ID: z.string().min(1, "AUTH_GITHUB_ID is required"),
  AUTH_GITHUB_SECRET: z.string().min(1, "AUTH_GITHUB_SECRET is required"),
  ADMIN_GITHUB_ID: z
    .string()
    .regex(/^\d+$/, "ADMIN_GITHUB_ID must be a numeric GitHub user id"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

function resolveServerEnvSource(): Record<string, string | undefined> {
  // On Cloudflare Workers `process.env` is a frozen proxy that carries plain
  // vars only — Worker secrets never appear there. `worker-entry.ts` publishes
  // the full binding set on `globalThis.__RUNTIME_ENV__` before the app loads.
  const runtimeBridge = (
    globalThis as unknown as { __RUNTIME_ENV__?: Record<string, string> }
  ).__RUNTIME_ENV__;
  const source: NodeJS.ProcessEnv = runtimeBridge
    ? { ...process.env, ...runtimeBridge }
    : process.env;
  if (!isDevelopment && !isTest) {
    return {
      AUTH_SECRET: source.AUTH_SECRET,
      AUTH_GITHUB_ID: source.AUTH_GITHUB_ID,
      AUTH_GITHUB_SECRET: source.AUTH_GITHUB_SECRET,
      ADMIN_GITHUB_ID: source.ADMIN_GITHUB_ID,
      DATABASE_URL: resolveDatabaseUrl(),
      DATABASE_AUTH_TOKEN: resolveDatabaseAuthToken(),
      NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL,
    };
  }

  return {
    AUTH_SECRET:
      source.AUTH_SECRET ?? "development-auth-secret-change-before-production",
    AUTH_GITHUB_ID: source.AUTH_GITHUB_ID ?? "development-github-client-id",
    AUTH_GITHUB_SECRET:
      source.AUTH_GITHUB_SECRET ?? "development-github-client-secret",
    ADMIN_GITHUB_ID: source.ADMIN_GITHUB_ID ?? "104575457",
    DATABASE_URL: resolveDatabaseUrl() ?? "file:./local.db",
    DATABASE_AUTH_TOKEN: resolveDatabaseAuthToken(),
    NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}

export const serverEnv = serverSchema.parse(resolveServerEnvSource());

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});
