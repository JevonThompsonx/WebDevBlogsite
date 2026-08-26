# Implementation Plan — Repository Audit & Roadmap

**Date:** 2026-08-25
**Project:** WebDevBlogsite (Next.js 16 App Router, TypeScript, Drizzle ORM, LibSQL/Turso)
**Status:** Active development — Cloudinary integration + Publish API in progress

---

## 1. Repository Overview

### Project Type

Production personal portfolio + technical blog with:

- Public pages: home, projects, blog, about
- Database-backed blog with published/draft states
- Protected admin area (GitHub OAuth, single-admin model)
- SEO: metadata, sitemap, robots.txt, RSS feed
- Markdown rendering with Shiki syntax highlighting

### Tech Stack

| Layer        | Version             |
| ------------ | ------------------- |
| Next.js      | 16.1.6 (App Router) |
| TypeScript   | 5.9.3               |
| Tailwind CSS | 4.2.1               |
| Drizzle ORM  | 0.45.1              |
| LibSQL/Turso | 0.17.0              |
| NextAuth     | 4.24.13             |
| Zod          | 4.3.6               |
| Bun          | 1.3.10              |
| Vitest       | 4.0.18              |

### Current State

- **Tests:** 59 tests passing across 6 files
- **Type-check:** Clean (`tsc --noEmit` passes)
- **Lint:** Clean (ESLint passes)
- **Git:** 12 commits ahead of `origin/main`, uncommitted changes in progress

---

## 2. Current Work in Progress (Uncommitted Changes)

### What's Being Built

#### 2.1 Cloudinary Image CDN Integration

**Status:** Implementation complete, tests passing

| File                                   | Purpose                                                       |
| -------------------------------------- | ------------------------------------------------------------- |
| `src/lib/cloudinary/transform.ts`      | URL transformation utilities (`cdnImageUrl`, `coverImageUrl`) |
| `src/lib/cloudinary/server.ts`         | Server-only config loader                                     |
| `src/lib/cloudinary/uploads.ts`        | Upload + validation (magic bytes, size, type)                 |
| `src/lib/cloudinary/transform.test.ts` | 9 tests for URL transforms                                    |
| `src/lib/cloudinary/uploads.test.ts`   | 12 tests for upload validation                                |

**Key design decisions:**

- `f_auto,q_auto` for format/quality optimization
- `w_1280,c_limit` for cover image width bounding
- Magic bytes validation prevents type spoofing
- 10MB max file size
- Allowed types: JPEG, PNG, WebP, GIF

#### 2.2 Publish API Route

**Status:** Implementation complete, tests passing

| File                                | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| `src/schemas/publish.ts`            | Zod validation schema                        |
| `src/app/api/publish/route.ts`      | POST endpoint for programmatic post creation |
| `src/app/api/publish/route.test.ts` | 14 tests covering auth, validation, uploads  |

**Key design decisions:**

- Bearer token auth via `PUBLISH_TOKEN` env var
- Supports both JSON and multipart/form-data
- Slug auto-derivation from title via `slugify()`
- CDN transform applied to cover image URLs
- Timing-safe token comparison

#### 2.3 Revalidation Utility Extraction

**Status:** Complete

| File                      | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| `src/lib/revalidation.ts` | Extracted `revalidatePostPages()` from blog actions |

#### 2.4 Cover Image Optimization on Blog Pages

**Status:** Complete

| File                                | Change                                            |
| ----------------------------------- | ------------------------------------------------- |
| `src/app/blog/[slug]/page.tsx`      | Uses `coverImageUrl()` for optimized cover images |
| `src/components/blog/blog-card.tsx` | Uses `coverImageUrl()` with fallback to raw URL   |

#### 2.5 Config Updates

**Status:** Complete

| File               | Change                                              |
| ------------------ | --------------------------------------------------- |
| `.env.example`     | Added `CLOUDINARY_*` and `PUBLISH_TOKEN` vars       |
| `next.config.ts`   | Added `res.cloudinary.com` to remote image patterns |
| `vitest.config.ts` | Added setup file + 30s timeout                      |

---

## 3. Risk Assessment

### Security Risks

| Risk                          | Severity | Mitigation                                                                |
| ----------------------------- | -------- | ------------------------------------------------------------------------- |
| `PUBLISH_TOKEN` in env        | MEDIUM   | Document rotation policy; consider adding rate limiting to `/api/publish` |
| Cloudinary credentials in env | LOW      | Already using env vars; `server-only` import prevents client leak         |
| Magic bytes validation        | GOOD     | Prevents type spoofing — well implemented                                 |
| Timing-safe token comparison  | GOOD     | Prevents timing attacks on publish endpoint                               |

### Architectural Risks

| Risk                                            | Severity | Mitigation                                                                      |
| ----------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| No rate limiting on `/api/publish`              | MEDIUM   | Add to middleware matcher or inline in route                                    |
| `proxy.ts` exports `proxy()` not `middleware()` | HIGH     | Next.js requires `middleware.ts` with `middleware()` export — file is dead code |
| No E2E tests                                    | MEDIUM   | Add Playwright for critical flows                                               |
| Single `posts` table, no relations              | LOW      | Acceptable for current scope                                                    |

### Critical Finding: Dead Middleware

The file `src/proxy.ts` exports `proxy()` but Next.js requires a file named `middleware.ts` exporting `middleware()`. This means:

- Rate limiting is **NOT active**
- CSP nonce headers are **NOT being set**
- All rate limit/CSP logic in `proxy.ts` is dead code

**This was marked "COMPLETED" in ASSESSMENT.md but the fix was never actually applied.** The file was renamed from `middleware.ts` to `proxy.ts` (commit `37e3c0a`) but the export was never renamed back, and the file was never renamed to `middleware.ts`.

---

## 4. Implementation Plan

### Phase 1: Fix Dead Middleware (CRITICAL)

**Goal:** Activate rate limiting and CSP headers by fixing the middleware file.

**Subtasks:**

| #   | Task                                        | File(s)                              | Agent                   |
| --- | ------------------------------------------- | ------------------------------------ | ----------------------- |
| 1.1 | Rename `src/proxy.ts` → `src/middleware.ts` | `src/proxy.ts` → `src/middleware.ts` | `@build-error-resolver` |
| 1.2 | Rename export `proxy` → `middleware`        | `src/middleware.ts:170`              | `@build-error-resolver` |
| 1.3 | Verify matcher config works                 | `src/middleware.ts:211-213`          | `@verifier`             |
| 1.4 | Add `/api/publish` to rate limit policy     | `src/middleware.ts:55-85`            | `@build-error-resolver` |
| 1.5 | Run tests to verify no regressions          | All test files                       | `@verifier`             |

**Acceptance Criteria:**

- `bun run type-check` passes
- `bun run test` passes (59+ tests)
- Middleware executes on requests (verify via log or response header)

---

### Phase 2: Commit Current Work (HIGH)

**Goal:** Commit the Cloudinary + Publish API changes as a feature commit.

**Subtasks:**

| #   | Task                              | File(s)                  | Agent             |
| --- | --------------------------------- | ------------------------ | ----------------- |
| 2.1 | Stage all uncommitted changes     | All modified + untracked | orchestrator      |
| 2.2 | Write conventional commit message | —                        | `@caveman-commit` |
| 2.3 | Commit                            | —                        | orchestrator      |
| 2.4 | Verify clean working tree         | `git status`             | `@verifier`       |

**Commit message template:**

```
feat: add Cloudinary image CDN integration and publish API

- Cloudinary URL transforms (f_auto,q_auto + w_1280,c_limit)
- Cover image upload with magic bytes validation
- POST /api/publish for programmatic post creation
- Bearer token auth for publish endpoint
- Revalidation utility extracted from blog actions
- Cover image optimization on blog pages
```

---

### Phase 3: Add Rate Limiting to Publish API (MEDIUM)

**Goal:** Protect `/api/publish` from abuse.

**Subtasks:**

| #   | Task                                    | File(s)                             | Agent                   |
| --- | --------------------------------------- | ----------------------------------- | ----------------------- |
| 3.1 | Add publish route to rate limit policy  | `src/middleware.ts`                 | `@build-error-resolver` |
| 3.2 | Add test for rate limit on publish      | `src/app/api/publish/route.test.ts` | `@tdd-guide`            |
| 3.3 | Verify rate limit triggers at threshold | Test                                | `@verifier`             |

---

### Phase 4: Test Coverage Expansion (MEDIUM)

**Goal:** Increase test coverage toward 80% target.

**Current coverage:** 59 tests across 6 files (transform, uploads, publish, blog actions, utils, security)

**Missing coverage (from ASSESSMENT.md):**

| Area               | Target File                          | Priority |
| ------------------ | ------------------------------------ | -------- |
| Server queries     | `src/server/queries/posts.ts`        | HIGH     |
| Auth flow          | `src/lib/auth.ts`                    | HIGH     |
| Schema validation  | `src/schemas/blog.ts`                | MEDIUM   |
| Markdown rendering | `src/lib/markdown.ts`                | MEDIUM   |
| API routes         | `src/app/feed.xml/route.ts`          | LOW      |
| Components         | `src/components/blog/code-block.tsx` | LOW      |

**Subtasks:**

| #   | Task                        | File(s)                            | Agent        |
| --- | --------------------------- | ---------------------------------- | ------------ |
| 4.1 | Add query layer tests       | `src/server/queries/posts.test.ts` | `@tdd-guide` |
| 4.2 | Add auth utility tests      | `src/lib/auth.test.ts`             | `@tdd-guide` |
| 4.3 | Add schema validation tests | `src/schemas/blog.test.ts`         | `@tdd-guide` |
| 4.4 | Add markdown helper tests   | `src/lib/markdown.test.ts`         | `@tdd-guide` |

---

### Phase 5: E2E Tests (MEDIUM)

**Goal:** Add Playwright tests for critical user flows.

**Subtasks:**

| #   | Task                       | File(s)                    | Agent         |
| --- | -------------------------- | -------------------------- | ------------- |
| 5.1 | Set up Playwright config   | `playwright.config.ts`     | `@e2e-runner` |
| 5.2 | Add admin CRUD flow test   | `e2e/admin-crud.spec.ts`   | `@e2e-runner` |
| 5.3 | Add blog reading flow test | `e2e/blog-reading.spec.ts` | `@e2e-runner` |
| 5.4 | Add navigation flow test   | `e2e/navigation.spec.ts`   | `@e2e-runner` |

---

### Phase 6: UX Improvements (LOW)

**Goal:** Add loading states, error boundaries, and search/pagination.

**Subtasks:**

| #   | Task                       | File(s)                                                    | Agent                   |
| --- | -------------------------- | ---------------------------------------------------------- | ----------------------- |
| 6.1 | Add loading.tsx for routes | `src/app/blog/loading.tsx`, `src/app/projects/loading.tsx` | `@build-error-resolver` |
| 6.2 | Add admin error boundary   | `src/app/admin/error.tsx`                                  | `@build-error-resolver` |
| 6.3 | Add blog pagination        | `src/app/blog/page.tsx` + query                            | `@tdd-guide`            |
| 6.4 | Add category filtering     | `src/app/blog/page.tsx` + UI                               | `@tdd-guide`            |

---

## 5. Agent Mapping

| Phase               | Primary Agent           | Supporting Agents                 |
| ------------------- | ----------------------- | --------------------------------- |
| 1 — Fix Middleware  | `@build-error-resolver` | `@verifier`, `@security-reviewer` |
| 2 — Commit Work     | orchestrator            | `@caveman-commit`                 |
| 3 — Rate Limit      | `@build-error-resolver` | `@tdd-guide`                      |
| 4 — Test Expansion  | `@tdd-guide`            | `@verifier`                       |
| 5 — E2E Tests       | `@e2e-runner`           | `@verifier`                       |
| 6 — UX Improvements | `@build-error-resolver` | `@tdd-guide`                      |

---

## 6. File Inventory

### Modified Files (Uncommitted)

- `.env.example` — Added Cloudinary + Publish token vars
- `next.config.ts` — Added Cloudinary remote pattern
- `src/app/blog/[slug]/page.tsx` — Cover image optimization
- `src/components/blog/blog-card.tsx` — Cover image optimization
- `src/server/actions/blog.ts` — Extracted revalidation
- `src/server/actions/blog.test.ts` — Formatting
- `vitest.config.ts` — Added setup + timeout

### New Files (Untracked)

- `src/__tests__/vitest-setup.ts` — Test setup (mocks `server-only`)
- `src/app/api/publish/route.ts` — Publish API endpoint
- `src/app/api/publish/route.test.ts` — 14 tests
- `src/lib/cloudinary/server.ts` — Config loader
- `src/lib/cloudinary/transform.ts` — URL transforms
- `src/lib/cloudinary/transform.test.ts` — 9 tests
- `src/lib/cloudinary/uploads.ts` — Upload + validation
- `src/lib/cloudinary/uploads.test.ts` — 12 tests
- `src/lib/revalidation.ts` — Shared revalidation utility
- `src/schemas/publish.ts` — Publish schema

### Key Existing Files

- `src/proxy.ts` — **DEAD CODE** — needs rename to `middleware.ts`
- `src/server/queries/posts.ts` — Data access layer
- `src/server/actions/blog.ts` — Server actions (CRUD)
- `src/lib/auth.ts` — NextAuth config
- `src/lib/env.ts` — Env validation
- `drizzle/schema.ts` — Database schema
- `.github/workflows/ci.yml` — CI pipeline

---

## 7. Priority Order

1. **Phase 1** — Fix dead middleware (CRITICAL security issue)
2. **Phase 2** — Commit current work (clean slate)
3. **Phase 3** — Rate limit publish API (security hardening)
4. **Phase 4** — Test coverage expansion (quality)
5. **Phase 5** — E2E tests (confidence)
6. **Phase 6** — UX improvements (nice-to-have)

---

## 8. Verification Checklist

- [ ] `bun run type-check` passes
- [ ] `bun run lint` passes
- [ ] `bun run format:check` passes
- [ ] `bun run test` passes (59+ tests)
- [ ] `bun run build` passes
- [ ] Middleware active (rate limiting + CSP)
- [ ] No hardcoded secrets
- [ ] No debug logging left in code
- [ ] All env vars documented in `.env.example`
