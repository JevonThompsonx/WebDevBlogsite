# Project Assessment Checklist

**Date:** 2026-06-18
**Project:** WebDevBlogsite (Next.js 16 App Router)
**Status:** Production-ready with improvement opportunities

---

## Critical Issues

### 1. Dead Middleware — Rate Limiting & CSP Not Active ✅ COMPLETED
- **File:** `src/middleware.ts` (renamed from `src/proxy.ts`)
- **Problem:** Exports `proxy()` function but Next.js requires `middleware()` in `middleware.ts`. No `middleware.ts` exists anywhere in the project. The rate limiting, CSP nonce generation, and content security policy logic in this file are **never executed**.
- **Impact:** No rate limiting on API routes or server actions. No CSP headers beyond what `next.config.ts` provides (basic X-Frame-Options, etc.).
- **Fix:** Rename file to `middleware.ts`, rename export to `middleware`, verify matcher config works.
- **Priority:** CRITICAL

### 2. Inaccurate Deletion Log ✅ COMPLETED
- **File:** `docs/DELETION_LOG.md`
- **Problem:** Claims `engineering-backend-architect.md` and `handoff.md` were deleted in the 2026-04-11 cleanup, but both files still exist at the project root. The deletion log is stale/inaccurate.
- **Impact:** Documentation distrust. Future developers may not know what's actually in the repo.
- **Fix:** Either delete the files for real, or update the deletion log to reflect they were restored.
- **Priority:** HIGH

### 3. Stray Agent Personality Files at Project Root ✅ COMPLETED
- **Files:** `engineering-backend-architect.md`, `docs/engineering-security-engineer.md` (both deleted)
- **Problem:** AI agent personality/definition files that don't belong in a production codebase. `engineering-backend-architect.md` is at the project root (235 lines of agent persona). `docs/engineering-security-engineer.md` is in docs (304 lines).
- **Impact:** Repo clutter, confusion for contributors, bloat.
- **Fix:** Delete both files. They belong in an AI config directory, not the project.
- **Priority:** HIGH

---

## Faulty Code

### 4. Unnecessary Promise.all Destructuring ✅ COMPLETED
- **File:** `src/app/blog/[slug]/page.tsx:55` (fixed)
- **Code:** `const [adjacentPosts] = await Promise.all([getAdjacentPublishedPosts(slug)]);`
- **Problem:** Wraps a single async call in `Promise.all` and destructures the first element. `Promise.all` with one argument is pointless overhead.
- **Fix:** `const adjacentPosts = await getAdjacentPublishedPosts(slug);`
- **Priority:** MEDIUM

### 5. site.ts Bypasses Validated Environment ✅ COMPLETED
- **File:** `src/lib/site.ts:6` (fixed)
- **Code:** `url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"`
- **Problem:** Uses raw `process.env` instead of the validated `publicEnv` from `env.ts`. This bypasses Zod validation and could produce stale or incorrect values if the env var changes after module initialization.
- **Fix:** Import `publicEnv` and use `publicEnv.NEXT_PUBLIC_APP_URL`.
- **Priority:** MEDIUM

### 6. Admin Delete Action Silently Swallows Auth Errors ✅ COMPLETED
- **File:** `src/server/actions/blog.ts:188-193` (fixed)
- **Code:** `catch { return; }` after `requireAdmin()`
- **Problem:** When an unauthorized user tries to delete, the action silently returns void. No feedback, no error state. The caller has no way to know the operation failed.
- **Fix:** Return an error state or throw, similar to create/update actions.
- **Priority:** MEDIUM

---

## Performance Issues

### 7. Blog Posts Force-Dynamic on Every Request ✅ COMPLETED
- **File:** `src/app/blog/[slug]/page.tsx:45` (fixed - ISR enabled)
- **Code:** `export const dynamic = "force-dynamic";`
- **Problem:** Every blog post visit triggers a fresh database query. Blog posts change infrequently. This prevents ISR (Incremental Static Regeneration) which would serve cached pages and revalidate in the background.
- **Fix:** Remove `force-dynamic`, add `revalidate = 3600` (or appropriate interval) for ISR. Use `revalidateTag` in admin actions to bust cache on edits.
- **Priority:** HIGH

### 8. Adjacent Posts Query Makes 3 Sequential DB Calls ✅ COMPLETED
- **File:** `src/server/queries/posts.ts:97-135` (fixed)
- **Problem:** `getAdjacentPublishedPosts` calls `getPublishedPostBySlug` (1 query), then queries for previous post (2), then next post (3). Three sequential round-trips.
- **Fix:** Combine into a single query using subqueries or CTEs, or at minimum run the previous/next queries in parallel with `Promise.all`.
- **Priority:** MEDIUM

### 9. slugExists Fetches Full Post Record ✅ COMPLETED
- **File:** `src/server/queries/posts.ts:137-152` (fixed)
- **Problem:** `slugExists` calls `getPostBySlug` which selects all columns (`postColumns`) just to check if a slug exists. Wasteful I/O.
- **Fix:** Use a lightweight `SELECT 1 FROM posts WHERE slug = ? LIMIT 1` query.
- **Priority:** LOW

### 10. Shiki Highlighter Initializes Per-Request ✅ COMPLETED
- **File:** `src/lib/markdown.ts:104-108` (fixed)
- **Problem:** `getCodeHighlighter` uses React `cache()` which is per-request. Each request creates a new Shiki highlighter instance, loading all 18 languages into memory.
- **Fix:** Use a module-level singleton (global variable) so the highlighter is created once and shared across requests.
- **Priority:** MEDIUM

### 11. RSS Feed Has No Cache Headers ✅ COMPLETED
- **File:** `src/app/feed.xml/route.ts` (fixed)
- **Problem:** Returns XML with only `Content-Type` header. No `Cache-Control`. Every request hits the database.
- **Fix:** Add `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`.
- **Priority:** MEDIUM

### 12. Sitemap Has No Caching ✅ COMPLETED
- **File:** `src/app/sitemap.ts` (fixed)
- **Problem:** Queries database on every request. Sitemap data rarely changes.
- **Fix:** Add `revalidate = 3600` or use `unstable_cache` / `revalidateTag`.
- **Priority:** LOW

---

## Dead Code & Clutter

### 13. handoff.md at Project Root ✅ COMPLETED
- **File:** `handoff.md` (deleted)
- **Problem:** AI session handoff notes from a previous session. Not useful to contributors. The DELETION_LOG says it was deleted but it's still here.
- **Fix:** Delete it.
- **Priority:** MEDIUM

### 14. engineering-backend-architect.md at Project Root ✅ COMPLETED
- **File:** `engineering-backend-architect.md` (deleted)
- **Problem:** 235-line AI agent personality definition. Not project code.
- **Fix:** Delete it.
- **Priority:** MEDIUM

### 15. docs/engineering-security-engineer.md ✅ COMPLETED
- **File:** `docs/engineering-security-engineer.md` (deleted)
- **Problem:** 304-line AI agent personality definition in the docs directory.
- **Fix:** Delete it.
- **Priority:** MEDIUM

---

## Test Coverage Gaps

### 16. Minimal Test Coverage ✅ COMPLETED
- **Current:** Only 2 test files: `src/lib/utils.test.ts` (4 tests) and `src/lib/security.test.ts` (4 tests). Total: 8 tests.
- **Missing:**
  - Server action tests (create/update/delete post)
  - Query layer tests (posts, projects)
  - Auth flow tests (isAdminSession, signIn callback)
  - Schema validation tests (blog schemas)
  - Markdown rendering tests (TOC extraction edge cases, code highlighting)
  - API route tests (feed.xml, sitemap)
  - Component tests (PostForm, CodeBlock, MobileMenu)
- **Fix:** Add tests per the TDD workflow. Target 80%+ coverage.
- **Priority:** HIGH

### 17. No E2E Tests
- **Problem:** No Playwright tests for critical user flows (admin CRUD, blog reading, navigation).
- **Fix:** Add E2E tests for: login → create post → verify public post → edit → delete → verify removal.
- **Priority:** HIGH

---

## Security Concerns

### 18. No Rate Limiting (Related to #1) ✅ COMPLETED
- **Impact:** Server actions and API routes are unprotected. An attacker could spam create/update/delete actions.
- **Fix:** Fix middleware first (#1), then verify rate limits work. (Completed in item #1)

### 19. CSP Headers Incomplete ✅ COMPLETED
- **File:** `next.config.ts:26-51`
- **Problem:** `next.config.ts` sets basic security headers but no Content-Security-Policy. The CSP in `proxy.ts` is dead code.
- **Fix:** Either activate the middleware CSP or add CSP to `next.config.ts` headers. (Completed in item #1 - middleware now active)

### 20. bodySizeLimit at 2mb May Be Excessive
- **File:** `next.config.ts:57`
- **Problem:** `serverActions.bodySizeLimit: "2mb"` is generous for a blog. A malicious admin could upload very large payloads.
- **Fix:** Consider reducing to 512kb or 1mb unless there's a specific need.

---

## Documentation Issues

### 21. README Doesn't Mention proxy.ts / Middleware
- **Problem:** README and ARCHITECTURE.md don't document the middleware layer (because it's dead code). If it's activated, docs need updating.

### 22. ARCHITECTURE.md Missing Rate Limiting Documentation
- **Problem:** The architecture doc doesn't mention rate limiting, CSP, or the proxy layer.

### 23. handoff.md References Completed Work
- **Problem:** `handoff.md` describes "recent backend hardening" and "recent frontend changes" as if they just happened. This is stale context from a previous session.

---

## Improvement Opportunities

### 24. Add Blog Pagination
- **Problem:** Blog index loads all published posts. If the blog grows, this becomes slow.
- **Fix:** Add cursor-based or offset-based pagination.

### 25. Add Category Filtering
- **Problem:** Blog posts have categories but no filtering UI on the blog index.
- **Fix:** Add category filter chips/tabs to `/blog`.

### 26. Add Search Functionality
- **Problem:** No way to search blog posts by title or content.
- **Fix:** Add a search input to the blog index with client-side or server-side filtering.

### 27. Add Loading States / Suspense Boundaries
- **Problem:** Pages show nothing while data loads. No skeleton UI or loading indicators.
- **Fix:** Add `loading.tsx` files for routes and Suspense boundaries for async components.

### 28. Add Error Boundaries for Admin
- **Problem:** No error boundary specifically for admin pages. Errors fall through to the root error boundary.
- **Fix:** Add `src/app/admin/error.tsx`.

### 29. Optimize Image Imports
- **Problem:** Some pages import Lucide icons individually (good) but some import multiple icons from the same page component. Consider if tree-shaking is optimal.
- **Priority:** LOW

### 30. Add Open Graph Image Generation
- **Problem:** All pages use a static `/images/mySite.webp` for OG images. Dynamic OG images per blog post would improve social sharing.
- **Fix:** Use Next.js `ImageResponse` or a static generation approach for per-post OG images.
- **Priority:** LOW

---

## Priority Summary

| Priority | Count | Items |
|----------|-------|-------|
| CRITICAL | 1 | #1 (Dead middleware) |
| HIGH | 5 | #2, #3, #7, #16, #17 |
| MEDIUM | 9 | #4, #5, #6, #8, #10, #11, #13, #14, #15 |
| LOW | 5 | #9, #12, #29, #30, + others |
| INFO | 10 | #18-#28 (improvements) |
