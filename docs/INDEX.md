# Documentation Index

One line per document. Keep this in sync when adding/removing docs.

## Root docs

| Doc                   | Path                       | Summary                                                                    |
| --------------------- | -------------------------- | -------------------------------------------------------------------------- |
| README                | `../README.md`             | Project overview, quick start, commands, routes, env vars, deployment      |
| Agent hub (uppercase) | `../AGENTS.md`             | Canonical agent entry point: TOC, rules, workflow, gates, gotchas          |
| Agent mirror (lower)  | `../agents.md`             | Per-repo mirror of AGENTS.md (declared canonical for per-repo rules)       |
| Modernization TODO    | `../MODERNIZATION_TODO.md` | **Historical** 2026-08-24 audit; several items resolved since — see banner |

## docs/

| Doc          | Path                   | Summary                                                                    |
| ------------ | ---------------------- | -------------------------------------------------------------------------- |
| Architecture | `ARCHITECTURE.md`      | Layers, request flows, file guide, security features, known-issues history |
| Assessment   | `ASSESSMENT.md`        | 2026-06-18 30-item assessment checklist (most items completed)             |
| CI fix       | `CI_FIX.md`            | 2026-08-28 CI stabilization: Zod dummy env for build + trivy `v0.36.0`     |
| Deletion log | `DELETION_LOG.md`      | 2026-04-11 and 2026-06-18 file/dependency deletion records                 |
| Deployment   | `DEPLOYMENT.md`        | GitHub → Vercel deploy guide, env vars, Turso, post-deploy verification    |
| Loop agent   | `LOOP-AGENT-PROMPT.md` | Prompt template driving the assessment task queue through a loop agent     |
| Plan         | `PLAN.md`              | **Historical** 2026-08-25 plan (Cloudinary + publish API); see banner      |
| Rate limit   | `RATE_LIMIT.md`        | Rate-limit design (`src/proxy.ts`, rightmost XFF) + Upstash proposal       |
| Vuln fix     | `VULN_FIX.md`          | 2026-08-28 `next`/`drizzle-orm` HIGH CVE fix record (commit `06350d5`)     |
