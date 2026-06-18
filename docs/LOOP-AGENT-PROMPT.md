# Loop Agent Prompt — WebDevBlogsite Improvements

Use with: `/loop-start infinite fast`

## Context

This is a Next.js 16 App Router personal portfolio/blog site. An assessment has been completed at `docs/ASSESSMENT.md` with 30 prioritized items. This prompt drives a loop agent to work through them autonomously.

## Loop Protocol

### Branch Strategy
- Create a branch per assessment item: `fix/<item-number>-<short-slug>`
- Example: `fix/1-activate-middleware`, `fix/7-blog-isr`, `fix/16-add-tests`
- Each branch gets ONE focused change
- Merge to main after verification passes
- Delete branch after merge

### Per-Iteration Workflow

```
1. READ docs/ASSESSMENT.md — find next uncompleted item by priority
2. CREATE branch: git checkout -b fix/<item-number>-<slug>
3. IMPLEMENT the fix
4. VERIFY:
   a. bun run type-check (must pass)
   b. bun run lint (must pass)
   c. bun run test (must pass)
   d. bun run build (must pass)
5. SPAWN @code-reviewer sub-agent to review the change
6. ADDRESS any CRITICAL/HIGH findings from reviewer
7. COMMIT with message: fix: <item-number> <description>
8. MERGE: git checkout main && git merge --no-ff fix/<item-number>-<slug>
9. DELETE branch: git branch -d fix/<item-number>-<slug>
10. UPDATE docs/ASSESSMENT.md — mark item as [x] completed
11. UPDATE handoff.md — note what was done
12. CONTINUE to next item
```

### Sub-Agent Requirements

**MANDATORY sub-agents per iteration:**
- `@code-reviewer` — after every implementation, before commit
- `@security-reviewer` — for items #1, #18, #19, #20 (security-related)
- `@tdd-guide` — for items #16, #17 (test coverage)
- `@build-error-resolver` — if any verification step fails

**Optional sub-agents:**
- `@refactor-cleaner` — after items #13, #14, #15 (dead code cleanup)
- `@doc-updater` — after items #21, #22 (documentation updates)

### Verification Gate

Before merging ANY branch, ALL of these must be true:
- [ ] `bun run type-check` exits 0
- [ ] `bun run lint` exits 0
- [ ] `bun run test` exits 0
- [ ] `bun run build` exits 0
- [ ] `@code-reviewer` returned no CRITICAL findings
- [ ] No hardcoded secrets or debug output in diff
- [ ] No TODO/FIXME added (unless tracking known tech debt)

If any check fails → fix on the same branch, re-verify, then merge.

---

## Task Queue (Priority Order)

Work through these in order. Skip only if explicitly blocked.

### CRITICAL (Do First)

- [ ] **#1 — Activate Middleware**
  - Rename `src/proxy.ts` → `src/middleware.ts`
  - Rename export `proxy` → `middleware`
  - Verify rate limiting works (test with rapid requests)
  - Verify CSP headers are present in responses
  - Branch: `fix/1-activate-middleware`
  - Sub-agents: `@code-reviewer`, `@security-reviewer`

### HIGH (Do Next)

- [ ] **#2 — Fix Inaccurate Deletion Log**
  - Update `docs/DELETION_LOG.md` to reflect that `engineering-backend-architect.md` and `engineering-security-engineer.md` have now been deleted
  - Branch: `fix/2-fix-deletion-log`
  - Sub-agents: `@code-reviewer`

- [ ] **#3 — Delete Stray Agent Files**
  - Already deleted: `engineering-backend-architect.md`, `docs/engineering-security-engineer.md`
  - Verify they're gone, update any references
  - Branch: `fix/3-delete-stray-files`
  - Sub-agents: `@code-reviewer`

- [ ] **#7 — Enable ISR for Blog Posts**
  - In `src/app/blog/[slug]/page.tsx`: remove `export const dynamic = "force-dynamic"`
  - Add `export const revalidate = 3600` (1 hour)
  - In admin actions (`src/server/actions/blog.ts`): add `revalidateTag('blog')` after mutations
  - In `src/app/blog/[slug]/page.tsx`: wrap post fetch with `unstable_cache` and tag
  - Branch: `fix/7-blog-isr`
  - Sub-agents: `@code-reviewer`, `@architect`

- [ ] **#16 — Add Unit Tests for Server Actions**
  - Create `src/server/actions/blog.test.ts`
  - Test: createPostAction success, validation failure, auth failure, slug conflict
  - Test: updatePostAction success, not found, slug conflict
  - Test: deletePostAction success, auth failure
  - Mock: `@/lib/auth`, `@/server/queries/posts`
  - Branch: `fix/16-server-action-tests`
  - Sub-agents: `@tdd-guide`, `@code-reviewer`

- [ ] **#17 — Add Integration Tests for Queries**
  - Create `src/server/queries/posts.test.ts`
  - Test: getPublishedPosts, getPublishedPostBySlug, slugExists, insertPost, etc.
  - Use in-memory SQLite for test database
  - Branch: `fix/17-query-tests`
  - Sub-agents: `@tdd-guide`, `@code-reviewer`

### MEDIUM (Do After High)

- [ ] **#4 — Fix Promise.all Destructuring**
  - In `src/app/blog/[slug]/page.tsx:55`: simplify to `const adjacentPosts = await getAdjacentPublishedPosts(slug)`
  - Branch: `fix/4-fix-promise-all`
  - Sub-agents: `@code-reviewer`

- [ ] **#5 — Fix site.ts Environment Bypass**
  - In `src/lib/site.ts`: import `publicEnv` and use it instead of raw `process.env`
  - Branch: `fix/5-fix-site-env`
  - Sub-agents: `@code-reviewer`

- [ ] **#6 — Fix Admin Delete Silent Failure**
  - In `src/server/actions/blog.ts:188-193`: return error state instead of silent return
  - Branch: `fix/6-fix-delete-error-handling`
  - Sub-agents: `@code-reviewer`

- [ ] **#8 — Optimize Adjacent Posts Query**
  - In `src/server/queries/posts.ts:getAdjacentPublishedPosts`: run previous/next queries in parallel with `Promise.all`
  - Branch: `fix/8-parallel-adjacent-queries`
  - Sub-agents: `@code-reviewer`, `@database-reviewer`

- [ ] **#10 — Singleton Shiki Highlighter**
  - In `src/lib/markdown.ts`: use module-level `let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null` instead of React `cache()`
  - Branch: `fix/10-singleton-highlighter`
  - Sub-agents: `@code-reviewer`

- [ ] **#11 — Add RSS Cache Headers**
  - In `src/app/feed.xml/route.ts`: add `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` to response
  - Branch: `fix/11-rss-cache-headers`
  - Sub-agents: `@code-reviewer`

- [ ] **#13 — Delete handoff.md**
  - Remove `handoff.md` from project root (it's stale session notes)
  - Update `docs/ASSESSMENT.md` to note deletion
  - Branch: `fix/13-delete-handoff`
  - Sub-agents: `@refactor-cleaner`

- [ ] **#14-15 — Delete Remaining Stray Files**
  - Verify no other stray files remain
  - Branch: `fix/14-15-cleanup-stray`
  - Sub-agents: `@refactor-cleaner`

### LOW (Do After Medium)

- [ ] **#9 — Lightweight slugExists Query**
  - In `src/server/queries/posts.ts`: replace `getPostBySlug` call with `SELECT 1 FROM posts WHERE slug = ? LIMIT 1`
  - Branch: `fix/9-lightweight-slug-check`
  - Sub-agents: `@code-reviewer`

- [ ] **#12 — Add Sitemap Caching**
  - In `src/app/sitemap.ts`: add `export const revalidate = 3600`
  - Branch: `fix/12-sitemap-cache`
  - Sub-agents: `@code-reviewer`

- [ ] **#24 — Add Blog Pagination**
  - Add cursor-based pagination to `src/app/blog/page.tsx`
  - Update `getPublishedPosts` to accept limit/offset
  - Add pagination UI component
  - Branch: `feat/24-blog-pagination`
  - Sub-agents: `@tdd-guide`, `@code-reviewer`

- [ ] **#25 — Add Category Filtering**
  - Add category filter chips to blog index
  - Update queries to filter by category
  - Branch: `feat/25-category-filtering`
  - Sub-agents: `@tdd-guide`, `@code-reviewer`

- [ ] **#28 — Add Admin Error Boundary**
  - Create `src/app/admin/error.tsx` with admin-specific error UI
  - Branch: `feat/28-admin-error-boundary`
  - Sub-agents: `@code-reviewer`

---

## Completion Criteria

The loop is DONE when ALL items in `docs/ASSESSMENT.md` are marked `[x]` and:
- All verification gates pass
- All sub-agent findings addressed
- `handoff.md` reflects final state
- No branches left unmerged

## Failure Handling

| Situation | Response |
|-----------|----------|
| Build fails | Spawn `@build-error-resolver`, fix, re-verify |
| Test fails | Spawn `@tdd-guide`, fix test or implementation |
| Reviewer finds CRITICAL | Fix before commit. No exceptions. |
| Item blocked | Document why in handoff.md, skip to next |
| 3+ items blocked | STOP. Report to user. |

## Branch Cleanup

After ALL items complete:
```bash
git branch --merged main | grep -v main | xargs git branch -d
```

Verify no unmerged branches remain:
```bash
git branch --no-merged main
```
