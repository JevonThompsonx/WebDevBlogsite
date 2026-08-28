# AGENTS.md — WebDevBlogsite Living Hub

**Project:** WebDevBlogsite (Next.js 16.1.6 · Bun 1.3.10 · Drizzle · LibSQL/Turso · NextAuth v4) — /home/hermes/Projects/WebDevBlogsite
**Branch contract:** `main` is the modernized line (stale `feature/phase1-baseline` + `safety/phase1-baseline` deleted 2026-08-28, worktree `.worktrees/t_bf5e500e` removed). Work only on new branches off `main`.
**Last verified:** 2026-08-28 12:43 UTC — `npx tsc --noEmit` 0, `npx eslint .` 0, `npx prettier --check .` pass, `npx vitest run` 6 files 89/89 green, `npx next build` Turbopack compile 3.1s + 23/23 static pages. Working tree clean (`git status` clean, `git worktree list` 1 entry, `git branch` only `main`).

## Table of Contents (keep updated — this file is the entry point)

| Doc                   | Path                                                                                                  | Purpose                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Overall handoff plan  | /home/hermes/PROJECT_STATUS.md:1 (mirror /home/jevonx/PROJECT_STATUS.md:1 + /tmp/PROJECT_STATUS.md:1) | 12-repo snapshot, scores 0–100, TDD gates, TODO T1–T12, evidence appendix                     |
| Modernization TODO    | docs/MODERNIZATION_TODO.md:1 (also /home/hermes/Projects/WebDevBlogsite/MODERNIZATION_TODO.md:1)      | Security/efficiency/speed/QoL checklist — CSP, IP trust, RL store, content-blob queries, etc. |
| Rate limit deep dive  | docs/RATE_LIMIT.md:1                                                                                  | Current in-memory Map vs Upstash proposal, rightmost-XFF fix, cost/ops, alternatives          |
| Assessment (Phase 1)  | docs/ASSESSMENT.md:1                                                                                  | Static audit that seeded MODERNIZATION_TODO                                                   |
| Architecture          | docs/ARCHITECTURE.md:1                                                                                | System overview                                                                               |
| Deployment            | docs/DEPLOYMENT.md:1                                                                                  | Vercel + env vars                                                                             |
| Deletion log          | docs/DELETION_LOG.md:1                                                                                | Why files were removed                                                                        |
| Loop Agent Prompt     | docs/LOOP-AGENT-PROMPT.md:1                                                                           | Agent execution template                                                                      |
| Plan (legacy)         | docs/PLAN.md:1                                                                                        | Old plan, now superseded by PROJECT_STATUS                                                    |
| Plan / AGENTS at host | /home/hermes/AGENTS.md:1                                                                              | Hermes orchestration workflow (delegation, TDD, gates)                                        |

## Current State (2026-08-28)

- **Main is green and push-safe.** Verification above — all gates pass. Safe to `git push origin main` (already at ff5998e, up to date). Next work must be on a new branch (e.g., `fix/rate-limit-upstash` or `perf/lighten-list-queries`).
- **Recently merged (main@ff5998e):** 5688ea5 remove @auth/core + useThemeToggle, dbe4087 Cloudinary publish, ae36864 generateStaticParams, 363c4d6 TOC precompute, 37e3c0a proxy.ts rename, 1d11fb9 adjacentPosts single query, 0422b54 rightmost-XFF fix, bb1c0db husky+lint-staged.
- **CI status (2026-08-28):** `main` previously failed on Zod env + trivy 0.33.1 (see `docs/CI_FIX.md:1`). Honest fix applied: `ci` job dummy env + `0.36.0` bump; local TDD `next build` 23/23 green — awaiting CI run after push.
- **Open blockers (from MODERNIZATION_TODO, now tracked in PROJECT_STATUS T1–T12):**
  - P0 CSP `strict-dynamic`+nonce hydration unverified (live smoke test needed)
  - P0 rate-limit in-memory only (deferred per operator 2026-08-28 — see `docs/RATE_LIMIT.md:1`)
  - P1 list queries fetch full `content` blobs (needs projection)
  - P1 `experimental.serverActions` deprecated → move to top-level
- **Other repos:** See PROJECT_STATUS §4 — farmers-market 62 (P0 auth gaps), jsquared_blog 74, audioTransfer 80, proxmox 76, rog 75, Roms 73, TODO.tsx 64, searxng 60, audiobook 68, ventoy 100. Approved order: farmers-market → audioTransfer/rog → jsquared_blog → proxmox/Roms → TODO.tsx last. Pushing modernization branches to origin + PRs is APPROVED (T9).

## How to Work Here (TDD + Orchestrator)

1. Define acceptance criteria + failing test/check BEFORE code (RED).
2. Implement minimal fix (GREEN), then refactor.
3. Run full gate: `npx vitest run` + `npx tsc --noEmit` + `npx eslint .` + `npx prettier --check .` + `npx next build` + Semgrep/Trivy/Gitleaks (CI does). All 0/ green required.
4. Independent review (code-reviewer + verifier) — must score 90+/100 before merge. Max 2 repair cycles.
5. Keep docs updated same-turn: edit this AGENTS.md TOC + relevant doc (MODERNIZATION_TODO, RATE_LIMIT, etc.) and PROJECT_STATUS.

## Immediate Next Actions (from PROJECT_STATUS T1–T12)

- [x] T1/T2 done 2026-08-28: worktree + stale branches deleted, `git status` clean
- [ ] T3 verify CSP live (P0)
- [ ] T4 rate-limit Upstash (P0, awaiting your approval — see RATE_LIMIT.md)
- [ ] T7 lighten list queries (P1)
- [ ] T8 run TDD gates on all modernization branches before PRs (P0)
- [x] T9 push branches + open PRs — DONE 2026-08-28 19:46 UTC: 7 PRs farmers#15, audio#1, jsquared#63, rog#1, Roms#1, proxmox#1, TODO#30 + Add-Non-Steam master pushed (see PROJECT_STATUS evidence)

## Quick Commands

```bash
sudo -n -u hermes bash -c "cd /home/hermes/Projects/WebDevBlogsite && npx vitest run && npx tsc --noEmit && npx eslint . && npx prettier --check . && timeout 120 npx next build"
git -C /home/hermes/Projects/WebDevBlogsite status
git -C /home/hermes/Projects/WebDevBlogsite log --oneline -5
```
