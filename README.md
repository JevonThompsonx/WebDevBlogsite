# Jevon Thompson Personal Site

Personal portfolio and technical blog built with Next.js App Router, TypeScript, Tailwind CSS, Drizzle ORM, LibSQL/Turso, and GitHub OAuth admin authentication. Deployed on Vercel.

**Live site:** [web-dev-blogsite.vercel.app](https://web-dev-blogsite.vercel.app)

## What this is

A production Next.js application combining a public portfolio with a database-backed blog and a protected admin area.

- Public pages: home, projects, blog, and about
- Database-backed blog with published and draft states
- Protected admin area for full post CRUD
- GitHub OAuth — single-admin model via `ADMIN_GITHUB_ID`
- SEO: metadata, sitemap, robots.txt, and RSS feed
- Markdown rendering with Shiki syntax highlighting and table of contents

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js `16.1.6` (App Router) |
| Language | TypeScript `5.9.3` |
| Styles | Tailwind CSS `4.2.1` |
| ORM | Drizzle ORM `0.45.1` |
| Database | LibSQL / Turso |
| Auth | NextAuth `4.24.13` + GitHub OAuth |
| Validation | Zod `4.3.6` |
| Runtime | Bun `1.3.10` |
| Hosting | Vercel |

## Quick start

### 1. Install dependencies

```bash
bun install
```

### 2. Create your local env file

```bash
# Mac/Linux
cp .env.example .env.local

# PowerShell
Copy-Item .env.example .env.local
```

### 3. Fill in environment variables

```env
AUTH_SECRET="your-random-secret"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"
ADMIN_GITHUB_ID="your-numeric-github-user-id"
DATABASE_URL="file:./local.db"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For local development, `DATABASE_URL="file:./local.db"` works out of the box. `DATABASE_AUTH_TOKEN` is only needed for hosted Turso.

### 4. Set up the database

```bash
bun run db:migrate
bun run db:seed  # optional: adds sample posts
```

### 5. Start the dev server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Run migrations, then start Next dev server |
| `bun run build` | Run migrations, then create production build |
| `bun run start` | Start the built app |
| `bun run lint` | Run ESLint |
| `bun run type-check` | Run `tsc --noEmit` |
| `bun run test` | Run Vitest |
| `bun run db:generate` | Generate Drizzle migration files |
| `bun run db:migrate` | Apply pending SQL migrations |
| `bun run db:seed` | Insert sample blog posts |

## Project structure

```
src/
  app/          # Routes and pages (Next.js App Router)
  components/   # UI components (layout, blog, projects, admin)
  lib/          # Shared utilities (env, auth, db, markdown, site config)
  server/
    queries/    # Server-only data access layer
    actions/    # Server actions for admin mutations
  schemas/      # Zod validation schemas
  types/        # Shared TypeScript types

drizzle/        # Schema, migrations, seed script
content/        # Static project data (projects.ts)
public/         # Static assets
```

### Key routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog post |
| `/projects` | Projects index |
| `/projects/[slug]` | Project detail |
| `/about` | About page |
| `/admin` | Admin dashboard (protected) |
| `/admin/blog/new` | Create post (protected) |
| `/admin/blog/[slug]/edit` | Edit post (protected) |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Sitemap |

## Authentication

GitHub OAuth through NextAuth. Only one account has admin access, identified by numeric GitHub user ID.

Set `ADMIN_GITHUB_ID` to your GitHub numeric user ID. To find it:

```
https://api.github.com/users/<your-username>
```

Copy the `id` field from the response.

Auth files:
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/admin/layout.tsx`

## Database

Single `posts` table managed through Drizzle ORM and LibSQL.

| Field | Type |
|---|---|
| `id` | integer, primary key |
| `title` | text |
| `slug` | text, unique |
| `content` | text (markdown) |
| `excerpt` | text |
| `category` | text |
| `coverImage` | text, nullable |
| `published` | boolean |
| `createdAt` | text (ISO 8601) |
| `updatedAt` | text (ISO 8601) |

Schema: `drizzle/schema.ts`

Migrations run automatically on `bun run dev` and `bun run build`. Applied migrations are tracked in `__migrations` so re-runs are safe.

## Portfolio content

Projects are statically defined in `content/projects.ts`. This is intentional — the project list is manually curated, and some entries intentionally omit internal URLs and configuration details for security reasons.

## Environment variables

### Auth

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Session signing secret (random string) |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `ADMIN_GITHUB_ID` | Numeric GitHub user ID for the admin account |

### Database

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path or hosted LibSQL URL |
| `DATABASE_AUTH_TOKEN` | Required for hosted Turso with token auth |
| `TURSO_DATABASE_URL` | Vercel Turso integration variable (supported natively) |
| `TURSO_AUTH_TOKEN` | Vercel Turso integration token (supported natively) |

### App

| Variable | Description |
|---|---|
| `NEXTAUTH_URL` | Auth callback base URL (important in production) |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL for metadata and feeds |

## Vercel deployment

### Required setup

1. Create a GitHub OAuth app with callback URL:
   ```
   https://your-domain.com/api/auth/callback/github
   ```

2. Connect Turso to your Vercel project (or set `DATABASE_URL` manually).

3. Add environment variables in Vercel:
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
   - `ADMIN_GITHUB_ID`
   - `NEXTAUTH_URL=https://your-domain.com`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`

4. Deploy. Vercel uses `vercel.json` which sets the install command to `bun install` and build command to `bun run build`.

### If using the Vercel Turso integration

The app reads `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` directly. You do not need to duplicate them as `DATABASE_URL`/`DATABASE_AUTH_TOKEN`.

### Production database seeding

If your production database is empty after first deploy:

```bash
DATABASE_URL="libsql://your-db.turso.io" DATABASE_AUTH_TOKEN="your-token" bun run db:seed
```

## Local development notes

- `local.db` is created automatically and is gitignored
- `.env.local` is gitignored — never commit real secrets
- Development mode provides fallback env values so the app starts without all variables set
- Production requires all variables to be present; missing values throw a validation error at startup

## Extra docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — detailed codebase walkthrough
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — full deployment and auth/database setup reference
