# AGENTS.md — WebDevBlogsite Living Hub

**Project:** WebDevBlogsite — `/home/hermes/Projects/WebDevBlogsite` · Next.js 16.3.3 · Bun 1.3.10 · Drizzle 0.45.2 · LibSQL/Turso · NextAuth 4.24.15
**Branch contract:** `main` is the modernized line (stale `feature/phase1-baseline`/`safety/phase1-baseline` deleted 2026-08-28, worktree `.worktrees/t_bf5e500e` removed). Work on new branches off `main`.
**Last verified:** 2026-08-28 20:35 UTC — `main@06350d5` all 4 CI jobs SUCCESS (`ci`/`sast`/`secrets-scan`/`dependency-scan`, run 33208912835) · gates `tsc 0` `eslint 0` `prettier pass` `vitest 89/89` `next build 23/23`.

## Table of Contents (entry point — keep updated)

| Doc                | Path                                                                                                        | Purpose                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Handoff / scores   | `/home/hermes/PROJECT_STATUS.md:1` (mirrors `/home/jevonx/PROJECT_STATUS.md:1`, `/tmp/PROJECT_STATUS.md:1`) | 12-repo snapshot, 0–100 scores, TDD gates, T1–T12, evidence          |
| Modernization TODO | `./MODERNIZATION_TODO.md:1`                                                                                 | CSP, IP trust, RL store, query projection, serverActions — checklist |
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

## How to Work Here (TDD + Orchestrator — 5 steps)

1. **RED before GREEN:** Define acceptance criteria + failing check first — no code without pass criteria.
2. **Implement minimal fix**, then refactor.
3. **Full gate before push:** `npx vitest run` + `npx tsc --noEmit` + `npx eslint .` + `npx prettier --check .` + `npx next build` (+ `semgrep`/`trivy`/`gitleaks` in CI). All `0`/green; `0–59 fail` `60–89 partial` `90–100 pass` — thresholds never lowered.
4. **Independent review:** `code-reviewer`/`verifier` (not builder) scores `≥90` before complete; max 2 repair cycles.
5. **Docs same-turn:** Update this TOC + relevant `docs/*.md` + `PROJECT_STATUS` evidence; keep links valid (`file:line`).

## Current State (pointer — detail lives elsewhere)

> Lean by design — details in `PROJECT_STATUS` + `docs/*`, not duplicated here.

- **Status:** `main` green and push-safe — see `/home/hermes/PROJECT_STATUS.md:1` §Current + `./docs/VULN_FIX.md:1` / `./docs/CI_FIX.md:1`.
- **Blockers:** P0 CSP hydration + P0 rate-limit deferred are in `./MODERNIZATION_TODO.md:1` → tracked as T1–T12 in `PROJECT_STATUS`.
- **Dependabot/other repos:** See `PROJECT_STATUS` evidence (2026-08-28 batch: 10 adopted, 2 reverted; 7 PRs pushed 19:46 UTC).

## Quick Commands

```bash
sudo -n -u hermes bash -c "cd /home/hermes/Projects/WebDevBlogsite && npx vitest run && npx tsc --noEmit && npx eslint . && npx prettier --check . && timeout 120 npx next build"
git -C /home/hermes/Projects/WebDevBlogsite status -sb
git -C /home/hermes/Projects/WebDevBlogsite log --oneline -5
gh run list --branch main --limit 5
```
