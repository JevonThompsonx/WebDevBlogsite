# Rate Limiting — Design, Current State, and Upstash Proposal

**Last verified:** 2026-08-28 via `src/proxy.ts`, `src/lib/rate-limit.ts` (farmers-market), live `npx vitest`/`next build` green
**Status:** WebDev main is in-memory only (functional but weak on serverless). Farmers-market already has Upstash with fail-open fallback.

## Current Implementation

### WebDevBlogsite — `src/proxy.ts:22` (see file, ~90 lines)

- Store: `globalThis.__rateLimitStore: Map<string, RateLimitEntry>` — per-instance, survives HMR via globalThis but NOT across Vercel serverless instances. Prunes only when `size >= 2000` (loop deletes expired). Otherwise unbounded until hit threshold → slow memory growth.
- Policies (`getRateLimitPolicy`):
  - `POST` with `next-action` header (Server Actions): `server-actions` bucket 40/min (120/min dev) `windowMs: 60000`
  - `/api/auth/*`: `auth-api` 30/min (120 dev)
  - `/api/*`: `api` 120/min (240 dev)
  - Everything else: no limit (CSP/nonce still runs)
- Key: `${bucket}:${getClientIp(request)}` — `getClientIp` now trusts **rightmost** `X-Forwarded-For` hop (`src/proxy.ts:29` fixed from leftmost). Falls back to `x-real-ip` then `"unknown"` (collapse bucket = DoS vector if many unknowns share bucket — low risk, but noted).
- Enforcement: sync `consumeRateLimit` → 429 with `Retry-After` + `Cache-Control: no-store` if over limit.
- Matcher: `config.matcher = ["/((?!_next/static|_next/image|favicon.ico).*)"]` — runs on all pages + APIs (correct, unlike farmers-market old matcher).

**Why it works locally but is weak on Vercel:** Each serverless function gets its own Map. An attacker can round-robin across ~10s of instances and get 10× the limit. On hobby/low-traffic it still slows abuse, but it is **not** a security guarantee.

### farmers-market — `src/lib/rate-limit.ts` (contrast)

- Already has `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` → `@upstash/ratelimit` sliding window (`Ratelimit.slidingWindow`). Prefix `farmers-market:rate-limit`, analytics off. When env vars present, uses distributed Redis (correct).
- Fallback when not configured: same in-memory Map (500 threshold) — **fail-open** (allows traffic, just weak). TODO warns to make Upstash mandatory in prod.

## What Upstash Proposal Changes (for WebDev)

1. **Deps:** add `@upstash/redis` + `@upstash/ratelimit` (same as farmers-market, ~30kB, no server weight).
2. **Refactor `src/proxy.ts`:** mirror farmers-market pattern:
   ```ts
   const redis =
     process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
       ? new Redis({ url, token })
       : null;
   // in proxy(): if (redis) await redisLimiter.limit(key) else if (prod) throw/fail-closed else fallback Map
   ```
   Because `proxy()` is Edge-compatible, use `export const config = {matcher: [...]}` unchanged; Upstash REST is Edge-safe (fetch-based).
3. **Fail-closed in prod:** If `NODE_ENV=production` and Redis not configured → either 500 or log + allow but warn. Recommended: **fail-closed for auth/api buckets**, log for others — prevents silent bypass.
4. **Fail-open in dev:** keep Map so `bun run dev` needs no creds.
5. **Tests (TDD):** add `src/proxy.test.ts` or `src/lib/rate-limit.test.ts`:
   - rightmost XFF wins (`"1.1.1.1, 2.2.2.2, 3.3.3.3"` → `3.3.3.3`)
   - spoofed leftmost ignored
   - 41st request in window → 429
   - Upstash mock returns success:false → 429
6. **Env:** add to `.env.example`: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (optional in dev, required in prod).

## Alternatives Considered

| Option                             | Pros                                                                                                        | Cons                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Keep in-memory only + document gap | Zero cost, zero code                                                                                        | Not real protection on Vercel; MUST document as “best-effort only” |
| Upstash REST (recommended)         | Shared state, Edge-safe, free tier 10k cmds/day, already used in farmers-market, Vercel integration 1-click | Requires secrets, adds external dep                                |
| Vercel KV (Upstash under hood)     | Same as above, Vercel-native                                                                                | Same secrets, Vercel lock-in                                       |
| Self-hosted Redis                  | No vendor                                                                                                   | Not serverless-friendly, ops burden                                |

## Cost / Ops

- Upstash free: 10k requests/day, 256 MB — enough for rate-limit (only auth/api/server-actions counted, not every page). Paid $10/mo for 100k/day if needed.
- Secrets: set `UPSTASH_REDIS_REST_URL/TOKEN` in Vercel dashboard + `.env.local` (gitignored). No code change to deploy — proxy auto-detects.
- Risk if not approved: keep current Map, update `MODERNIZATION_TODO.md:28` and this doc to mark “in-memory best-effort, not prod-guaranteed” and add TTL pruning below 2000 (current only prunes above 2000).

## Decision Needed

Approve Upstash (recommended) or keep documented in-memory gap? If approved, implement in next branch `fix/rate-limit-upstash` with TDD tests before merge.
