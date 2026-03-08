# Jevon Thompson Personal Site

Modern portfolio and blog rebuilt with Next.js App Router, TypeScript, Tailwind CSS, Drizzle ORM, LibSQL, and GitHub-based admin authentication.

## What this repo is

This is a full rewrite of the old Express + EJS portfolio/blog into a production-oriented Next.js application.

It includes:

- public marketing pages for home, projects, blog, and about
- a database-backed blog with published and draft states
- a protected admin area for post management
- GitHub OAuth admin auth
- SEO support with metadata, sitemap, robots, and RSS
- markdown blog rendering with syntax-highlighted code blocks

## Tech stack

- Next.js `16.1.6`
- React `19.2.4`
- TypeScript `5.9.3`
- Tailwind CSS `4.2.1`
- Drizzle ORM `0.45.1`
- LibSQL client `0.17.0`
- NextAuth `4.24.13`
- Zod `4.3.6`
- Bun `1.3.10`

## Project goals

- replace the old in-memory blog with real persistence
- make the site deployable to Vercel
- keep the portfolio story and project showcase intact
- support admin-only blog CRUD
- make the repo understandable and maintainable after upload

## Quick start

### 1. Install dependencies

```bash
bun install
```

### 2. Create your local env file

Mac/Linux:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 3. Fill in the required environment variables

Required values:

- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `ADMIN_GITHUB_ID`
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN` for hosted LibSQL/Turso only
- `NEXT_PUBLIC_APP_URL`

For local development, `DATABASE_URL="file:./local.db"` works out of the box.

### 4. Run database setup

```bash
bun run db:migrate
bun run db:seed
```

### 5. Start the app

```bash
bun run dev
```

Open `http://localhost:3000`.

## Scripts

- `bun run dev` - runs migrations, then starts Next dev server
- `bun run build` - runs migrations, then creates production build
- `bun run start` - starts built app
- `bun run lint` - runs ESLint
- `bun run type-check` - runs `tsc --noEmit`
- `bun run test` - runs Vitest
- `bun run db:generate` - generates Drizzle migrations
- `bun run db:migrate` - applies SQL migrations
- `bun run db:seed` - inserts sample content

## How the app is organized

### App routes

- `src/app/page.tsx` - homepage
- `src/app/blog/page.tsx` - blog index
- `src/app/blog/[slug]/page.tsx` - blog post page
- `src/app/projects/page.tsx` - projects index
- `src/app/projects/[slug]/page.tsx` - project detail
- `src/app/about/page.tsx` - about page
- `src/app/admin/page.tsx` - admin dashboard
- `src/app/admin/blog/new/page.tsx` - create post
- `src/app/admin/blog/[slug]/edit/page.tsx` - edit post
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `src/app/feed.xml/route.ts` - RSS feed
- `src/app/sitemap.ts` - sitemap generation
- `src/app/robots.ts` - robots rules

### Key folders

- `src/components` - UI, layout, blog, project, and admin components
- `src/lib` - env validation, auth config, DB client, markdown helpers, metadata helpers, utilities
- `src/server/queries` - server-only data access layer
- `src/server/actions` - server actions for blog mutations
- `src/schemas` - Zod validation schemas
- `drizzle` - schema, migration SQL, seed script
- `content` - static project data
- `public` - static assets actually used by the app

## Data flow

### Blog reads

1. Pages call query functions in `src/server/queries/posts.ts`
2. Queries read from the `posts` table through Drizzle
3. Public pages only use published posts
4. Admin pages can read both drafts and published posts

### Blog writes

1. Admin forms submit to server actions in `src/server/actions/blog.ts`
2. Input is validated with Zod
3. Admin identity is checked before any mutation
4. Data is written through query helpers
5. Pages are revalidated after changes

## Authentication model

This project uses GitHub OAuth through NextAuth.

Only one GitHub account is treated as admin.

The admin check works by comparing the authenticated GitHub user id with `ADMIN_GITHUB_ID`.

Main auth files:

- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/admin/layout.tsx`

## Database model

Current database table:

- `posts`

Fields include:

- `title`
- `slug`
- `content`
- `excerpt`
- `category`
- `coverImage`
- `published`
- `createdAt`
- `updatedAt`

Main schema file:

- `drizzle/schema.ts`

## Markdown rendering

Posts are stored as raw markdown in the database.

Rendering behavior lives mainly in:

- `src/components/blog/post-content.tsx`
- `src/lib/markdown.ts`

Features currently implemented:

- GitHub-flavored markdown
- syntax-highlighted code blocks using Shiki
- copy button for code blocks
- heading-based table of contents
- image rendering through `next/image`

## Environment variables explained

### Auth

- `AUTH_SECRET` - session signing secret
- `AUTH_GITHUB_ID` - GitHub OAuth app client id
- `AUTH_GITHUB_SECRET` - GitHub OAuth app client secret
- `ADMIN_GITHUB_ID` - your numeric GitHub account id

### Database

- `DATABASE_URL` - local file path or hosted LibSQL URL
- `DATABASE_AUTH_TOKEN` - required for hosted LibSQL/Turso if your database uses token auth

### App

- `NEXT_PUBLIC_APP_URL` - canonical app URL for metadata and feeds

## Local development notes

- `bun run dev` and `bun run build` both run migrations first
- sample posts are only added when you run `bun run db:seed`
- a local `local.db` file is created automatically when using SQLite-style local dev
- `.env.local`, `local.db`, and other generated files are gitignored

## Vercel deployment notes

Recommended production setup:

- deploy app on Vercel
- use hosted LibSQL/Turso for persistence
- configure GitHub OAuth callback URL:
  `https://your-domain.com/api/auth/callback/github`
- set all environment variables in the Vercel dashboard

Production checklist:

- `bun install`
- `bun run type-check`
- `bun run lint`
- `bun run test`
- `bun run build`
- verify sign-in works
- verify admin CRUD works
- verify sitemap and RSS route output

## GitHub upload checklist

Before pushing this repo:

- make sure `.env.local` is not committed
- make sure `local.db` is not committed
- keep `bun.lock` committed
- verify the old legacy files are intentionally removed in your commit
- add your repo URL to the README if you want public visitors to find source quickly

## Extra docs

- `docs/ARCHITECTURE.md` - deeper codebase walkthrough
- `docs/DEPLOYMENT.md` - deployment and auth/database setup details

## Current status

Verified locally with:

- `bun run type-check`
- `bun run test`
- `bun run lint`
- `bun run build`
