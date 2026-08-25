# WebDevBlogsite — Modernization Todo List

**Project:** Next.js 16.1.6 App Router blog/portfolio · Bun 1.3.10 · Drizzle ORM · LibSQL/Turso · NextAuth v4
**Audit date:** 2026-08-24
**Re-audited (Phase 2):** `main` @ `fd0907235580255d68a564f3ec277a6c572f602b` — see `/tmp/second-audit-WebDev.md` and `/tmp/baseline-WebDev.md`.
**Audited:** `package.json`, `next.config.ts`, `vercel.json`, `src/middleware.ts`, `src/lib/*`, `src/server/*`, `drizzle/*`, `docs/ASSESSMENT.md`, CI workflow
**Method:** static read of source + `docs/ASSESSMENT.md` (which already closed 30 prior items). This list captures what remains and what regressed/needs verification.

Legend: 🔴 blocking/likely-broken · 🟠 high · 🟡 medium · 🟢 low/cleanup

---

## ✅ Things already done well (verified)
- [x] Zod env validation (`src/lib/env.ts`) with strict prod requirements
- [x] XSS hardening: `react-markdown` without `rehype-raw` (raw HTML not rendered), link/image hrefs sanitized (`isSafeLinkHref`, `resolveSafeImageSource`), external links get `rel="noopener noreferrer"`
- [x] Server-action admin guard (`requireAdmin()` → `isAdminSession()`) + admin layout redirect — **both symbols exist and compose correctly** (see Wave Status correction). `requireAdmin()` (`src/server/actions/blog.ts:37`) wraps `isAdminSession()` (`src/lib/auth.ts:85`); no rename needed.
- [x] Rate limiting + CSP in active middleware (`src/middleware.ts`, correctly named)
- [x] ISR: `revalidate` on blog post (3600), blog index (60), sitemap (3600); RSS `Cache-Control` header
- [x] Shiki highlighter is a module-level singleton (not per-request)
- [x] Security headers in `next.config.ts` (HSTS, X-Frame-Options, etc.)
- [x] CI: type-check + lint + test + build + Semgrep + Trivy + Gitleaks
- [x] Secrets not hardcoded; `.env.local` gitignored

---

## 🔴 SECURITY — blocking / needs verification

- [ ] **Verify CSP `'strict-dynamic'` + nonce does not break the app.** `src/middleware.ts:145` emits `script-src 'self' 'nonce-…' 'strict-dynamic'`. Next.js framework-injected inline scripts (RSC flight, hydration, error overlay) are **not** automatically nonce'd, so a strict CSP can block hydration and throw console errors in production. Confirm the live site hydrates cleanly under this policy; if not, either thread the nonce into Next's scripts or relax `script-src`. *(Medium-high, must verify before trusting "CSP active".)*
- [ ] **Replace `getClientIp` header trust.** `src/middleware.ts:26-44` trusts `x-forwarded-for` / `x-real-ip` first. On non-Vercel/proxied hosts this is fully spoofable → rate-limit bypass. Prefer Next's `request.ip` (set on Vercel/Edge) with the header as fallback only; collapse to a shared/`"unknown"` bucket is also a DoS vector against legitimate users.
- [ ] **Rate limit store is per-instance in-memory.** `src/middleware.ts:21-24` uses a `globalThis` Map. On Vercel/serverless each invocation may hit a different instance → limits are weak and uneven; the Map also only prunes when >2000 entries (slow memory growth). Migrate to a shared store (Upstash Ratelimit / Vercel KV) for real protection.
- [ ] **Audit the `@auth/core` / `next-auth` split.** `package.json` ships both `@auth/core@0.34.3` *and* `next-auth@4.24.13`. v4 bundles its own core; `@auth/core` is currently **unused** (no import found in `src/`). This is dead weight and a confusion/maintenance hazard. Decide one path:
  - (a) Drop `@auth/core` and stay on NextAuth v4, **or**
  - (b) Migrate to Auth.js v5 (the `@auth/*` line) — which is the modern, React 19-friendly path.
  - See Efficiency #1 and QoL #2.

## 🟠 SECURITY — high

- [ ] **NextAuth v4 on React 19 / Next 16.** `next-auth@4.24.13` officially targets React 18; the project runs React 19.2.4 + Next 16. Expect peer-dependency warnings and watch for runtime quirks (e.g. `getServerSession` behavior, signIn callback). Plan the v5 migration (ties to the `@auth/core` decision above).
- [ ] **`style-src 'unsafe-inline'` is broad.** Required-ish for Next/Tailwind v4, but reduces CSP value. Confirm Tailwind v4 emits a real stylesheet (not inline `<style>`) and tighten if possible.
- [ ] **`img-src … https:` is unbounded.** `next.config.ts:148` allows any `https` image host via `next/image`, while markdown images are already restricted to https by `resolveSafeImageSource`. Consider scoping `img-src` to known hosts (`ALLOWED_IMAGE_HOSTS`) for defense-in-depth.

## 🟡 SECURITY — medium

- [ ] **`dangerouslySetInnerHTML` for Shiki HTML** (`src/components/blog/code-block.tsx:44`) is acceptable *only* because Shiki escapes output — keep it that way; never pipe unsanitized content through it. Add a comment/test asserting Shiki output is the sole source.
- [ ] **`experimental.serverActions` is deprecated in Next 16.** `next.config.ts:55-59` nests `serverActions.bodySizeLimit` under `experimental`. In Next 15+ `serverActions` is stable and should be top-level (`serverActions: { bodySizeLimit: "1mb" }`); the current form may be ignored with a warning, silently raising the effective body limit. Move it.
- [ ] **`vercel.json` lacks a `framework`/region/headers note** — fine as-is, but document that security headers come from `next.config.ts` (not vercel.json) so future edits don't get lost.

---

## ⚡ EFFICIENCY

- [ ] 🟠 **Remove unused `@auth/core` dependency** (`package.json:22`). Not imported anywhere; adds install weight and supply-chain surface. (Pairs with Security decisions above.)
- [ ] 🟡 **Blog list queries fetch full `content` blobs.** `getPublishedPosts` / `getLatestPublishedPosts` / `getPublishedPostBySlug`-for-lists select `postColumns` (incl. `content` text) even where only title/slug/excerpt/category/createdAt are needed (e.g. `src/app/blog/page.tsx`, cards, RSS). Add a lightweight projection query for list/index/RSS paths.
- [ ] 🟡 **`getAdjacentPublishedPosts` still does 3 round-trips** (`src/server/queries/posts.ts:97-135`) — now parallel via `Promise.all` but still 3 queries. Collapse to 1 query (window functions / subqueries) for fewer DB hits.
- [ ] 🟢 **Middleware Map never prunes below 2000 entries** — minor memory growth; add TTL pruning or switch to external store (see Security rate-limit item).
- [ ] 🟢 **`drizzle.config.ts` hardcodes `dialect: "sqlite"`** while `env.ts`/`drizzle.config.ts` accept `POSTGRES_*` URLs. If someone points at Postgres, `drizzle-kit generate` would misbehave. Detect dialect or document that only LibSQL/SQLite is supported.

---

## 🚀 SPEED

- [ ] 🟡 **Add `generateStaticParams` for blog posts.** Projects detail page has it (`src/app/projects/[slug]/page.tsx:16`) but `src/app/blog/[slug]/page.tsx` relies on on-demand ISR only. Pre-rendering known slugs at build removes first-visit latency and DB load.
- [ ] 🟢 **Precompute TOC / reading time less often.** `extractTableOfContents` + `estimateReadingTime` run on every post render; since the page is ISR-cached this is low impact, but could be derived at write-time and stored.
- [ ] 🟢 **Consider `next/dynamic` for above-the-fold-heavy client components** (e.g. `auth-controls`, `mobile-menu`) to trim initial JS on public pages.
- [ ] 🟢 **Fonts already use `next/font/google`** (self-hosted, no CLS) — good; no action.

---

## 🧰 QoL / DX

- [ ] 🟠 **Rename `src/middleware.ts` → `src/proxy.ts`** (Next 16 deprecation — build warns `"middleware" file convention is deprecated. Please use "proxy" instead`). Bundle with the §SEC-1.1–1.3 security fixes since they all live in this file. *(NEW — found in second audit; not previously in TODO.)*
- [ ] 🟠 **Add a Prettier config.** `prettier` + `prettier-plugin-tailwindcss` are devDeps but there is **no `.prettierrc` / config file and no `format` script**. Add `.prettierrc` (with the tailwind plugin) and a `format`/`format:check` script so CI can enforce formatting.
- [ ] 🟡 **Close the `@auth/core` vs `next-auth` decision** (Security) — pick v4-only or v5 migration and update `README.md`/docs accordingly.
- [ ] 🟡 **Add admin `error.tsx` and `loading.tsx`** (`src/app/admin/`). Only root `error.tsx` exists; admin mutations have no dedicated boundary or loading UI.
- [ ] 🟡 **Expand test coverage.** Currently ~`utils.test.ts`, `security.test.ts`, `blog.test.ts`. Missing: auth flow (`isAdminSession`, `signIn` callback), query layer, schema validation, markdown/TOC edge cases, API routes. CI already gates on `test` — add E2E (Playwright) for the admin CRUD flow.
- [ ] 🟢 **`@types/node@20` vs `engines.node: 22`** mismatch — bump `@types/node` to 22 for accurate typings.
- [ ] 🟢 **Open product improvements from `docs/ASSESSMENT.md` still unaddressed:** blog pagination (#24), category filtering (#25), search (#26), skeleton/Suspense loading (#27), per-post OG image generation (#30).
- [ ] 🟢 **Keep `docs/ASSESSMENT.md` in sync** — it is accurate as of this audit; fold these new items in or mark them so they don't get lost.

---

## Priority snapshot
| Area | 🔴 | 🟠 | 🟡 | 🟢 |
|------|----|----|----|----|
| Security | 3 (CSP verify, IP trust, RL store) | 3 | 3 | — |
| Efficiency | — | 1 | 2 | 2 |
| Speed | — | 1 | — | 3 |
| QoL/DX | — | 1 | 3 | 4 |

**Top 3 to do first:** (1) verify/fix the CSP nonce interaction, (2) decide the auth library direction (drop `@auth/core` or migrate to Auth.js v5) and remove the dead dep, (3) stop fetching full `content` in list queries.

---

## 🌊 Modernization Wave Status (2026-08-24)

**Current branch / SHA:** `main` @ `fd0907235580255d68a564f3ec277a6c572f602b` (clean working tree; `MODERNIZATION_TODO.md` itself is untracked).

### ✅ Wave 1 completions
- **None committed in this repo for the audit items.** The WebDevBlogsite audit items remain open — Wave 1 here was the *audit + TODO reconciliation* (Phase 1 baseline → Phase 2 second audit), which produced the corrections below. No source modernization was merged on this branch during the wave.

### 🔧 Corrections found (second audit supersedes Phase-1 baseline)
- **`requireAdmin()` / `isAdminSession()` is NOT a stale-name bug.** The Phase-1 baseline row "No `requireAdmin` symbol found — audit text stale" was **itself wrong**. `requireAdmin()` exists at `src/server/actions/blog.ts:37` and wraps `isAdminSession()` (`src/lib/auth.ts:85`); both are real and compose correctly. The ✅ entry above now states this explicitly — **do not "fix" a non-existent inconsistency.**
- **`@auth/core@0.34.3` provably unused** — grep of `src/` returns zero imports. Remove it now (Security #4 / Efficiency #1); it is dead weight regardless of the v4-stay vs v5 decision.
- **1.3 CSP `strict-dynamic` hydration risk remains UNVERIFIED** — needs a live running instance to confirm hydration doesn't break. Keep as the top must-verify item.
- **README exists but lacks the v4-vs-v5 / `@auth/core` decision note** (QoL #2 nuance) — after the decision, record it in README.
- **`middleware.ts` → `proxy.ts` rename** is a NEW Phase-2 finding (Next 16 deprecation warning). Added as a QoL item above and should be bundled with the §SEC-1.1–1.3 security fixes (all live in that file).

### 📋 Wave 2 queue (remaining — all need code changes)
- **SECURITY:** verify CSP `strict-dynamic`+nonce vs live hydration; stop trusting raw `x-forwarded-for`/`x-real-ip` (use `request.ip`); migrate rate-limit store off `globalThis` to Upstash/KV + TTL; remove `@auth/core` + decide v4-stay vs Auth.js v5; add Shiki-sink comment/test.
- **RELIABILITY/PERF:** collapse list queries to a `content`-less projection (Efficiency #2); collapse `getAdjacentPublishedPosts` to 1 query (Efficiency #3); add `generateStaticParams` to `blog/[slug]` (Speed #1); add admin `error.tsx`/`loading.tsx` (QoL #3).
- **QoL/DX:** rename `middleware.ts`→`proxy.ts`; add `.prettierrc` + `format`/`format:check` scripts (CI); bump `@types/node` to 22; document `next.config.ts` (not `vercel.json`) as the security-header source; expand test coverage + Playwright admin-CRUD E2E; keep `docs/ASSESSMENT.md` synced.
