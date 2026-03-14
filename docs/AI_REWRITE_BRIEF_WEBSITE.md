# AI Rewrite Brief - WebDevBlogsite

This document is meant to be handed to an AI coding model so it can understand this project well enough to plan or execute a rewrite in the same spirit.

## Project identity

- Name: `WebDevBlogsite`
- Current role of the site: personal portfolio + technical blog
- Public positioning: systems administrator with a web development background
- Current deployment target: Vercel
- Current database approach: LibSQL/Turso
- Admin model: single GitHub-authenticated admin account

## What the project does

This project is a modern rewrite of an older Express and EJS portfolio site.

It combines:

- a public portfolio site
- a blog with published and draft content
- a protected admin area for blog management
- markdown rendering with code highlighting
- SEO support through metadata, sitemap, robots, and RSS

## Rewrite goals

If this project were rewritten again, the new version should preserve these goals:

1. keep the site easy to deploy on modern hosting platforms
2. keep admin auth simple and secure
3. keep the writing experience straightforward for a single author
4. keep the portfolio content easy to edit without digging through many files
5. support both self-hosted infrastructure projects and web-app projects in the same portfolio
6. preserve strong SEO and a polished reading experience

## Current stack

### Frontend / app framework

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Auth

- NextAuth / GitHub OAuth
- single-admin access controlled by `ADMIN_GITHUB_ID`

### Data

- Drizzle ORM
- LibSQL / Turso
- one main `posts` table

### Content rendering

- markdown stored in the database
- `react-markdown`
- `remark-gfm`
- Shiki for code highlighting

## Main user flows

### Public reader flow

1. user lands on homepage
2. sees role summary, featured projects, latest blog posts, and profile information
3. can browse projects or read a blog post
4. individual posts render markdown, headings, code blocks, cover image, and table of contents

### Admin flow

1. admin signs in with GitHub
2. admin accesses `/admin`
3. admin creates, edits, publishes, or deletes posts
4. changes revalidate public pages and feeds

## Architectural layout

### Routing

- `src/app/page.tsx` - homepage
- `src/app/blog/page.tsx` - blog index
- `src/app/blog/[slug]/page.tsx` - blog post detail
- `src/app/projects/page.tsx` - all projects
- `src/app/projects/[slug]/page.tsx` - project detail
- `src/app/about/page.tsx` - about page
- `src/app/admin/**` - admin routes
- `src/app/api/auth/[...nextauth]/route.ts` - auth API

### Data access

- `src/server/queries/posts.ts` - read/write helpers for posts
- `src/server/actions/blog.ts` - server actions for admin mutations
- `drizzle/schema.ts` - database schema
- `drizzle/migrate.ts` - custom SQL migration runner

### Shared app logic

- `src/lib/env.ts` - env parsing and fallbacks
- `src/lib/auth.ts` - auth configuration
- `src/lib/db.ts` - database client
- `src/lib/markdown.ts` - markdown helpers and TOC extraction
- `src/lib/site.ts` - biography, links, and skills content

### UI structure

- `src/components/layout` - header, footer, nav, auth controls
- `src/components/blog` - cards, markdown rendering, TOC, code blocks
- `src/components/projects` - project cards and project grid
- `src/components/admin` - post form, delete button, slug sync

## Data model summary

### Posts table

Current post fields:

- `id`
- `title`
- `slug`
- `content`
- `excerpt`
- `category`
- `coverImage`
- `published`
- `createdAt`
- `updatedAt`

This is intentionally simple.

There is no multi-author system, no revision history, and no public user accounts.

## Content management approach

### Portfolio content

Portfolio projects are currently hard-coded in:

- `content/projects.ts`

This works well because:

- there are not many projects
- some entries are intentionally private and should stay manually curated
- it keeps the public portfolio fast and predictable

### Blog content

Blog posts are stored in the database because they need:

- drafts vs published state
- admin CRUD
- dynamic updates after deployment

## Design and brand direction

### Current visual direction

- inspired by an older personal portfolio color palette
- light mode centers soft blue-gray and off-white tones
- dark mode centers deep plum, pink, and violet tones
- personal portraits use transparent assets with a circular gradient ring

### Important visual constraints to preserve

- should feel personal, not like a generic starter template
- should support both desktop and mobile cleanly
- should keep the portrait and project imagery as part of the identity

## Deployment model

### Production

- Vercel for app hosting
- Turso / LibSQL for database
- GitHub OAuth for admin auth

### Important environment variables

- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `ADMIN_GITHUB_ID`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL` or `TURSO_DATABASE_URL`
- `DATABASE_AUTH_TOKEN` or `TURSO_AUTH_TOKEN`

## Known implementation choices worth preserving

1. dynamic blog post route so newly published posts work without requiring a rebuild
2. idempotent migration runner that tracks applied SQL files in `__migrations`
3. single-admin auth model instead of a full user management system
4. static project content for safety and simplicity
5. markdown rendering with syntax highlighting and heading TOC

## Known pain points / opportunities for a rewrite

1. admin UI is intentionally simple and could be improved
2. project data could eventually move to a CMS or database if growth demands it
3. richer post taxonomy, filtering, and pagination could be added
4. stronger automated testing for auth and content publishing would help

## If asking an AI to rewrite this project

Tell the model to preserve:

- portfolio + blog dual purpose
- systems-administrator-first branding
- GitHub-only admin authentication
- database-backed markdown blog
- Vercel-friendly deployment
- safe handling of private/self-hosted project descriptions without exposing attack surface

Tell the model to avoid:

- introducing public signup or multi-user complexity unless explicitly requested
- replacing the personal visual identity with a generic template
- exposing internal infrastructure details in public content
- relying on unstable beta packages unless there is a strong reason

## Suggested rewrite deliverables

If you want an AI to do a fresh rewrite, a good request would ask for:

1. architecture proposal
2. exact dependency choices and versions
3. route map
4. data model proposal
5. deployment plan
6. migration plan from old content/data
7. security notes for admin auth and self-hosted project descriptions
