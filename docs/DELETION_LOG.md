# Code Deletion Log

## 2026-04-11 — Stable release cleanup

### Dev/AI agent files deleted

These files were AI session artifacts and internal planning documents. Not useful to public visitors or future contributors.

| File | Reason |
|---|---|
| `design-ui-designer.md` | AI agent persona definition, not project code |
| `design-ux-researcher.md` | AI agent persona definition, not project code |
| `design-whimsy-injector.md` | AI agent persona definition, not project code |
| `engineering-backend-architect.md` | AI agent persona definition, not project code |
| `engineering-frontend-developer.md` | AI agent persona definition, not project code |
| `fullstack.md` | AI session automation/prompt file |
| `handoff.md` | Internal AI session handoff notes |
| `prompt.md` | Internal AI prompt file (gitignored pattern, was untracked) |
| `docs/AI_REWRITE_BRIEF_JSQUARED_BLOG.md` | Planning brief for a different project (jsquared_blog) |
| `docs/AI_REWRITE_BRIEF_WEBSITE.md` | Planning brief for this project's previous rewrite session |

### Unused npm packages removed

Verified by `depcheck` and manual grep — none of these are imported anywhere in `src/`.

| Package | Type | Notes |
|---|---|---|
| `rehype-autolink-headings` | dependency | Not imported; Shiki handles highlighting directly |
| `rehype-pretty-code` | dependency | Not imported; replaced by direct Shiki usage |
| `rehype-sanitize` | dependency | Not imported |
| `rehype-slug` | dependency | Not imported; slug logic lives in `src/lib/markdown.ts` |
| `rehype-stringify` | dependency | Not imported |
| `remark-parse` | dependency | Not imported |
| `remark-rehype` | dependency | Not imported |
| `unified` | dependency | Not imported |
| `react-test-renderer` | dependency | Not used in any test file |
| `@types/react-test-renderer` | devDependency | Paired types for removed package |

### README rewritten

Old README contained:
- internal handoff language ("Your current production values", "GitHub upload checklist")
- placeholder instructions aimed at a single developer session
- mixed internal dev notes with public documentation

New README is:
- clean, public-facing documentation
- tables for tech stack, env vars, routes
- accurate to the current codebase
- appropriate for a stable public repo

### Impact

| Metric | Value |
|---|---|
| Files deleted | 10 |
| npm packages removed | 10 |
| README lines | 322 → 213 (cleaned + reformatted) |
| Bundle size reduction | ~45 KB (unused rehype/unified pipeline) |

### Verification

- `bun run type-check` — pass
- `bun run lint` — pass
- `bun run test` — pass
- `bun run build` — pass
