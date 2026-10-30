# Cloudflare hosting — current state

**Last verified: 2026-10-30.** Live: <https://webdevblog.servicesorsubscriptions-natural894.workers.dev>

> **PENDING — admin login is not wired up yet.** The GitHub OAuth app's callback
> URL still points at the retired Vercel deployment. Fix one of two ways:
> (a) set it to
> `https://webdevblog.servicesorsubscriptions-natural894.workers.dev/api/auth/callback/github`,
> or (b) put `/admin` + `/api/admin` behind Cloudflare Access instead (pattern in
> `jsquared_blog/docs/CLOUDFLARE-HOSTING.md`: verify the signed
> `Cf-Access-Jwt-Assertion` with `jose`).

## What changed

Hosting moved from Vercel to **Cloudflare Workers on 2026-10-30**. The Vercel
account is suspended (`HTTP 402`, `DEPLOYMENT_DISABLED`) and no longer serves this
app; `vercel.json` is a leftover, unused by the deploy.

|        |                                                                   |
| ------ | ----------------------------------------------------------------- |
| Worker | `webdevblog` (account `363c056f9bacbdaa70d9138facfe3c25`)         |
| URL    | https://webdevblog.servicesorsubscriptions-natural894.workers.dev |
| Cfgs   | `cloudflare.config.ts` (vinext `cf/config`) + `worker-entry.ts`   |
| Deploy | `bun run deploy:cf` → `scripts/deploy-cloudflare.mjs`             |

`bun run deploy:cf` is the only supported deploy: build, deploy, re-apply Worker
secrets over the REST API, then health-check `/`. Never run a bare
`vinext-cloudflare deploy` (`bun run deploy:vinext`) — it rewrites the bindings
and silently drops every secret, leaving the site failing until they are
re-uploaded.

## Configuration

**Database** — Turso, own account, group `webdevjev`, database `webdevblog`,
migrated from the Vercel-managed `database-yellow` with row counts verified after
the copy. The Worker reads `DATABASE_URL` + `DATABASE_AUTH_TOKEN`; Drizzle also
accepts the legacy `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` pair
(`drizzle.config.ts`).

**Runtime config** — uploaded as Worker **secrets** from the repo-root `.env`
(mode 600, gitignored — never commit it). Exact list is `CONFIG_KEYS` in
`scripts/deploy-cloudflare.mjs`: `AUTH_SECRET`, `AUTH_GITHUB_ID`,
`AUTH_GITHUB_SECRET`, `ADMIN_GITHUB_ID`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`,
`CLOUDINARY_*` (3), `PUBLISH_TOKEN`; the script refuses to deploy without the
first five. Non-secret `NEXT_PUBLIC_APP_URL` lives in `cloudflare.config.ts`.
On Workers `process.env` is a frozen proxy (plain vars only), so `worker-entry.ts`
publishes the full binding set on `globalThis.__RUNTIME_ENV__` and `src/lib/env.ts`
merges it — read config through `src/lib/env.ts`, never `process.env` directly.

**Admin auth** — `next-auth` v4 GitHub OAuth, gated by `ADMIN_GITHUB_ID`.
`src/lib/auth.ts` and `src/app/api/auth/[...nextauth]/route.ts` contain
**required** CJS/ESM interop resolvers (next-auth v4 is CommonJS; under Vite the
default export can arrive wrapped in one or two `.default` layers) — do not
"simplify" them away.

## Verified routes (2026-10-30)

`/`, `/blog`, `/projects`, `/feed.xml`, `/api/auth/providers` → **200**;
`/admin` → **307** (auth guard, expected).

## Known follow-ups

- Image optimisation is off — no Cloudflare Images binding, so `next/image`
  serves unoptimised sources.
- Sentry source maps are partial under vinext.
- `README.md` / `docs/DEPLOYMENT.md` still describe the Vercel flow; this file
  supersedes them for hosting.
