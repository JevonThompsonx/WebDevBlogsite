import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isDevelopment = process.env.NODE_ENV === "development";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitPolicy = {
  bucket: string;
  limit: number;
  windowMs: number;
};

type GlobalWithRateLimitStore = typeof globalThis & {
  __rateLimitStore?: Map<string, RateLimitEntry>;
};

const globalWithRateLimitStore = globalThis as GlobalWithRateLimitStore;
const rateLimitStore =
  globalWithRateLimitStore.__rateLimitStore ??
  (globalWithRateLimitStore.__rateLimitStore = new Map<string, RateLimitEntry>());

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstAddress = forwardedFor.split(",")[0]?.trim();

    if (firstAddress && firstAddress.length > 0) {
      return firstAddress;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();

  if (realIp && realIp.length > 0) {
    return realIp;
  }

  return "unknown";
}

function getRateLimitPolicy(request: NextRequest): RateLimitPolicy | null {
  const pathname = request.nextUrl.pathname;
  const isServerActionPost =
    request.method === "POST" && request.headers.has("next-action");

  if (isServerActionPost) {
    return {
      bucket: "server-actions",
      limit: isDevelopment ? 120 : 40,
      windowMs: 60_000,
    };
  }

  if (pathname.startsWith("/api/auth/")) {
    return {
      bucket: "auth-api",
      limit: isDevelopment ? 120 : 30,
      windowMs: 60_000,
    };
  }

  if (pathname.startsWith("/api/")) {
    return {
      bucket: "api",
      limit: isDevelopment ? 240 : 120,
      windowMs: 60_000,
    };
  }

  return null;
}

function pruneExpiredEntries(now: number): void {
  if (rateLimitStore.size < 2_000) {
    return;
  }

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  pruneExpiredEntries(now);

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;

  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let raw = "";

  for (const byte of bytes) {
    raw += String.fromCharCode(byte);
  }

  return btoa(raw);
}

function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    `connect-src 'self' https://github.com https://api.github.com${isDevelopment ? " ws: wss:" : ""}`,
    "frame-src 'none'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function proxy(request: NextRequest) {
  const policy = getRateLimitPolicy(request);

  if (policy) {
    const key = `${policy.bucket}:${getClientIp(request)}`;
    const rateLimitResult = consumeRateLimit(key, policy.limit, policy.windowMs);

    if (!rateLimitResult.allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      });
    }
  }

  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy(nonce));
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
