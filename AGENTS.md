# AGENTS.md — WebDevBlogsite Living Hub

**Project:** WebDevBlogsite — `/home/hermes/Projects/WebDevBlogsite` · Next.js 16.3.4 · Bun 1.3.10 · Drizzle 0.45.2 · LibSQL 0.18.0/Turso · NextAuth 4.24.15 · Vitest 5.0.0
**Branch contract:** `main` is the modernized line (stale `feature/phase1-baseline`/`safety/phase1-baseline` deleted 2026-08-28, worktree `.worktrees/t_bf5e500e` removed). Work on new branches off `main`.
**Last verified:** 2026-10-15 (docs audit) on branch `chore/deps-wave2-webdev` — gates `tsc 0` `eslint 0` `prettier pass` `vitest 89/89`. `next build` NOT run during this audit (out of scope); CI runs it on `bun run build`.

## Table of Contents (entry point — keep updated)

| Doc                | Path                                                                                                        | Purpose                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Handoff / scores   | `/home/hermes/PROJECT_STATUS.md:1` (mirrors `/home/jevonx/PROJECT_STATUS.md:1`, `/tmp/PROJECT_STATUS.md:1`) | 12-repo snapshot, 0–100 scores, TDD gates, T1–T12, evidence          |
| Modernization TODO | `./MODERNIZATION_TODO.md:1`                                                                                 | CSP, IP trust, RL store, query projection, serverActions — checklist |
| Plan (historical)  | `./docs/PLAN.md:1`                                                                                          | Superseded 2026-08-25 plan (Cloudinary + publish API); read banner   |
| Rate limit         | `./docs/RATE_LIMIT.md:1`                                                                                    | In-memory Map vs Upstash, rightmost-XFF, cost                        |
| CI fix             | `./docs/CI_FIX.md:1`                                                                                        | Zod dummy env + `trivy@v0.36.0` root cause                           |
| Vuln fix           | `./docs/VULN_FIX.md:1`                                                                                      | `next`/`drizzle` 13 HIGH Honest fix (`06350d5`)                      |
| Assessment         | `./docs/ASSESSMENT.md:1`                                                                                    | Phase-1 static audit                                                 |
| Architecture       | `./docs/ARCHITECTURE.md:1`                                                                                  | System overview                                                      |
| Deployment         | `./docs/DEPLOYMENT.md:1`                                                                                    | Vercel + env                                                         |
| Deletion log       | `./docs/DELETION_LOG.md:1`                                                                                  | Removal rationale                                                    |
| Loop prompt        | `./docs/LOOP-AGENT-PROMPT.md:1`                                                                             | Agent template                                                       |
| Per-repo rules     | `./agents.md:1`                                                                                             | Persistent Rules (lowercase mirror)                                  |
| Global rules       | `~/.opencode/agents.md:1`                                                                                   | Cross-project Persistent Rules                                       |

## Persistent Rules

- [2026-08-28T20:00:00Z] Always apply Dependabot fixes by adopting suggestions, then close the PR — never merge. (canonical in `./agents.md:1` + `~/.opencode/agents.md:1`; log `remember <rule>` here with timestamp)

## Gotchas (read before editing code or docs)

- **`src/proxy.ts` is correct — do NOT rename it to `middleware.ts`.** Next.js 16 deprecated the `middleware.ts` convention in favor of `proxy.ts` exporting `proxy()`. Docs written before 2026-08-25 (e.g. `docs/PLAN.md`, `docs/ASSESSMENT.md` item #1, `MODERNIZATION_TODO.md` QoL row) still describe the old name — those are historical.
- **Bun is canonical** (`packageManager: bun@1.3.10`, scripts like `bun run db:migrate`). `bun` is not installed on every host; `npx`/`./node_modules/.bin/*` equivalents work (`vitest run`, `tsc --noEmit`, `eslint .`, `prettier --check .`).
- **Env file is `.env`** (gitignored). `README.md` historically said `.env.local` — both are gitignored; either works, `.env.example` is the template.
- **`src/lib/env.ts` only falls back in `NODE_ENV=development|test`.** CI `next build` runs production mode and needs real/dummy env (see `docs/CI_FIX.md`).
- **`MODERNIZATION_TODO.md` and `docs/PLAN.md` are point-in-time snapshots** — several items are already resolved (prettier config added, `@auth/core` removed, XFF rightmost fix). Verify against source before acting on them.

## How to Work Here (TDD + Orchestrator — 5 steps)

1. **RED before GREEN:** Define acceptance criteria + failing check first — no code without pass criteria.
2. **Implement minimal fix**, then refactor.
3. **Full gate before push:** `npx vitest run` + `npx tsc --noEmit` + `npx eslint .` + `npx prettier --check .` + `npx next build` (+ `semgrep`/`trivy`/`gitleaks` in CI). All `0`/green; `0–59 fail` `60–89 partial` `90–100 pass` — thresholds never lowered.
4. **Independent review:** `code-reviewer`/`verifier` (not builder) scores `≥90` before complete; max 2 repair cycles.
5. **Docs same-turn:** Update this TOC + relevant `docs/*.md` + `PROJECT_STATUS` evidence; keep links valid (`file:line`).

## Current State (pointer — detail lives elsewhere)

> Lean by design — details in `PROJECT_STATUS` + `docs/*`, not duplicated here.

- **Status:** gates green on the working branch (`tsc 0` `eslint 0` `prettier pass` `vitest 89/89`, verified 2026-10-15); `main` CI status last recorded in `PROJECT_STATUS` — see `/home/hermes/PROJECT_STATUS.md:1` §Current + `./docs/VULN_FIX.md:1` / `./docs/CI_FIX.md:1`. Note: `chore/deps-wave2-webdev` (vitest 5.0.0, Node 26) is the current working line.
- **Blockers:** P0 CSP hydration + P0 rate-limit deferred are in `./MODERNIZATION_TODO.md:1` → tracked as T1–T12 in `PROJECT_STATUS`.
- **Dependabot/other repos:** See `PROJECT_STATUS` evidence (2026-08-28 batch: 10 adopted, 2 reverted; 7 PRs pushed 19:46 UTC).

## Quick Commands

```bash
sudo -n -u hermes bash -c "cd /home/hermes/Projects/WebDevBlogsite && npx vitest run && npx tsc --noEmit && npx eslint . && npx prettier --check . && timeout 120 npx next build"
git -C /home/hermes/Projects/WebDevBlogsite status -sb
git -C /home/hermes/Projects/WebDevBlogsite log --oneline -5
gh run list --branch main --limit 5
```
