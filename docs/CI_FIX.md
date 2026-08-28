# CI Fix — Honest Stabilization 2026-08-28

**Issue:** GitHub reported many failed CI runs on `main` (33205240798, 33175965821, etc.) — not just dependabot.

**Root causes (verified via `gh run view --log-failed` and `gh api`):**

1. **`ci` job — `bun run build` ZodError** — `Error [ZodError]: Invalid input for AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, ADMIN_GITHUB_ID, DATABASE_URL, NEXT_PUBLIC_APP_URL` (see log `_not-found` collecting). `src/lib/env.ts` provides dev defaults only when `NODE_ENV=development|test`. CI `next build` runs as `production` (no `.env` secrets) → requires real env, crashes. Local passed because `.env` had values and fallback. **Honest fix:** Provide Zod-valid dummy env in `ci` job (CI placeholders, not secrets — real secrets in Vercel). Verified locally: dummy env → `next build` 23/23 pages OK; without → ZodError.

2. **`dependency-scan` — `Unable to resolve action aquasecurity/trivy-action@0.33.1`** — version does not exist. Latest verified via `gh api repos/aquasecurity/trivy-action/releases` is `0.36.0`. **Honest fix:** bump `0.33.1 → v0.36.0` (tags use v prefix) (not pin to fake or disable scan). Dependabot already suggested 0.36.0 in PR #32929053077.

**Changes:**

- `.github/workflows/ci.yml:17` add `env:` with 7 dummy vars for `ci` job
- `.github/workflows/ci.yml:62` bump trivy to v0.36.0 (v prefix required; tags are v0.x)`

**TDD verification:**

- Without fix: `next build` fails ZodError (reproduced via `gh log`).
- With fix: `AUTH_SECRET=ci-dummy ... npx next build` succeeds 3.4s 23/23 pages. Also `npx vitest run` 89/89, `tsc` 0, `eslint` 0, `prettier` pass — all 4 gates green before commit.

**Remaining dependabot PRs:** Still failing separately (e.g., eslint 10 incompat, node type bumps) — each needs honest version-compatibility fix, not auto-merge. This fix unblocks `main` only.

**Last verified:** 2026-08-28 via `gh run list`, `gh run view --log-failed`, `gh api`, local `next build` with/without env.
