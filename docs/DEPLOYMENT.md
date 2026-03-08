# Deployment Guide

This guide is focused on getting the project safely onto GitHub and then onto Vercel.

## 1. Push to GitHub

Before your first push:

- confirm `.env.local` is not tracked
- confirm `local.db` is not tracked
- confirm `.vercel/` is not tracked
- confirm `bun.lock` is tracked
- review the deleted legacy Express files so your commit reflects the rewrite clearly

Useful local checks:

```bash
git status
bun run type-check
bun run test
bun run lint
bun run build
```

## 2. Create GitHub OAuth app

In GitHub developer settings, create an OAuth app.

Suggested values:

- Homepage URL: your local or production domain
- Callback URL local: `http://localhost:3000/api/auth/callback/github`
- Callback URL production: `https://your-domain.com/api/auth/callback/github`

Use the generated client id and client secret in your env vars.

## 3. Get your GitHub numeric user id

You need your numeric GitHub id for `ADMIN_GITHUB_ID`.

Ways to get it:

- visit `https://api.github.com/users/<your-username>`
- copy the numeric `id` field from the JSON response

## 4. Database options

### Local development

Use:

```env
DATABASE_URL="file:./local.db"
```

### Production with Turso/LibSQL

Use something like:

```env
DATABASE_URL="libsql://your-db-name.turso.io"
DATABASE_AUTH_TOKEN="your-token"
```

If you added Turso through the Vercel integration, Vercel usually provides:

```env
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-token"
```

This app supports both naming styles.

## 5. Vercel configuration

In Vercel, add these environment variables:

- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `ADMIN_GITHUB_ID`
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN` if needed
- or `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` if you are using the Turso integration
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`

Set both `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your real production domain.

Example:

```env
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 6. Recommended Vercel project settings

Vercel can auto-detect this as a Next.js project, but this repo also includes `vercel.json` so the install/build commands are explicit.

Expected settings:

- Framework Preset: `Next.js`
- Install Command: `bun install`
- Build Command: `bun run build`
- Root Directory: repository root

If Vercel asks whether to use Bun, the answer is yes.

## 7. Exact deploy values for your current setup

Because you already connected Turso in Vercel, the database side should come from:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

If the integration did not expose those exact names, check Vercel's Environment Variables screen and use whichever database URL/token variables actually exist there. Your runtime error indicates the server could not see a database URL variable during request execution.

Set these additional Vercel variables manually:

```env
ADMIN_GITHUB_ID="104575457"
NEXTAUTH_URL="https://web-dev-blogsite.vercel.app"
NEXT_PUBLIC_APP_URL="https://web-dev-blogsite.vercel.app"
AUTH_SECRET="your-generated-secret"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"
```

Do not commit any of those values to GitHub.

Your GitHub OAuth callback URL should be:

```text
https://web-dev-blogsite.vercel.app/api/auth/callback/github
```

## 8. Deploy flow

Recommended order:

1. push repo to GitHub
2. import repo into Vercel
3. create your Turso/LibSQL database
4. add environment variables to Vercel
5. deploy
6. test sign-in and admin pages
7. seed content manually if needed

Important:

- this app queries the database during build for pages like blog, sitemap, and RSS
- preview deployments also need working database/auth env vars if you want them to succeed
- if you do not want previews to hit production data, create a separate preview database and preview env vars

## 9. First production seed

If your production database is empty after first deploy, seed it from your machine against the hosted database.

PowerShell example:

```powershell
$env:DATABASE_URL="libsql://your-db-name.turso.io"
$env:DATABASE_AUTH_TOKEN="your-token"
bun run db:seed
```

Mac/Linux example:

```bash
TURSO_DATABASE_URL="libsql://your-db-name.turso.io" TURSO_AUTH_TOKEN="your-token" bun run db:seed
```

If you prefer the generic names instead, `DATABASE_URL` and `DATABASE_AUTH_TOKEN` work too.

## 10. Post-deploy verification

Check these routes:

- `/`
- `/blog`
- `/projects`
- `/about`
- `/feed.xml`
- `/sitemap.xml`

Check these behaviors:

- admin redirect works when signed out
- admin sign-in only works for your GitHub account
- create/edit/delete post works
- draft posts do not appear publicly
- metadata URLs point to the production domain, not localhost

## 11. Common issues

### Build passes locally but auth fails in production

Usually means one of these:

- OAuth callback URL is wrong
- `AUTH_SECRET` is missing
- `ADMIN_GITHUB_ID` is not your numeric id
- `NEXTAUTH_URL` is missing or still set to localhost

### Blog data not persisting on Vercel

Usually means you are still using local SQLite-style config instead of a hosted LibSQL database.

If you already connected Turso in Vercel, confirm the integration actually created `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the correct environment.

### Metadata/feed links point to localhost

Set both `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to your production domain in Vercel.

### Vercel preview builds fail

Usually means Preview environment variables are missing.

Fix by either:

- copying the Production env vars into Preview for now, or
- creating a separate preview database and setting Preview-specific values

## 12. Migration behavior on Vercel

This project applies pending SQL migrations during `bun run build`.

How it works:

- `drizzle/migrate.ts` reads all SQL files in `drizzle/migrations`
- it stores applied migration file names in a `__migrations` table
- each deploy only applies files that have not already been recorded

This means:

- initial deployment can create the schema automatically
- later deployments can safely skip already-applied migrations
- new migration SQL files will be applied on the next build/deploy

## 13. Ongoing maintenance

When changing the post schema:

1. update `drizzle/schema.ts`
2. add/update migration SQL
3. run migrations locally
4. verify CRUD still works
5. deploy with updated env/database settings if needed
