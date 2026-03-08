# Deployment Guide

This guide is focused on getting the project safely onto GitHub and then onto Vercel.

## 1. Push to GitHub

Before your first push:

- confirm `.env.local` is not tracked
- confirm `local.db` is not tracked
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

## 5. Vercel configuration

In Vercel, add these environment variables:

- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `ADMIN_GITHUB_ID`
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN` if needed
- `NEXT_PUBLIC_APP_URL`

Set `NEXT_PUBLIC_APP_URL` to your real production domain.

## 6. Deploy flow

Recommended order:

1. push repo to GitHub
2. import repo into Vercel
3. add environment variables
4. deploy
5. test sign-in and admin pages
6. seed content manually if needed

## 7. Post-deploy verification

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

## 8. Common issues

### Build passes locally but auth fails in production

Usually means one of these:

- OAuth callback URL is wrong
- `AUTH_SECRET` is missing
- `ADMIN_GITHUB_ID` is not your numeric id

### Blog data not persisting on Vercel

Usually means you are still using local SQLite-style config instead of a hosted LibSQL database.

### Metadata/feed links point to localhost

Set `NEXT_PUBLIC_APP_URL` to your production domain in Vercel.

## 9. Ongoing maintenance

When changing the post schema:

1. update `drizzle/schema.ts`
2. add/update migration SQL
3. run migrations locally
4. verify CRUD still works
5. deploy with updated env/database settings if needed
