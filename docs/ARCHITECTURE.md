# Architecture Guide

This document explains how the rewritten portfolio is structured so you can change it confidently after uploading to GitHub.

## High-level architecture

The app is split into a few clear layers:

1. `src/app` handles routing and page composition
2. `src/components` handles reusable UI and feature components
3. `src/lib` handles shared infrastructure code
4. `src/server/queries` is the data access layer
5. `src/server/actions` handles authenticated write operations
6. `drizzle` defines and migrates the database
7. `content` stores static portfolio project content

## Request flow examples

### Public blog page

1. User visits `/blog/my-post`
2. `src/app/blog/[slug]/page.tsx` loads the post with `getPublishedPostBySlug`
3. Data comes from `src/server/queries/posts.ts`
4. Markdown is rendered through `src/components/blog/post-content.tsx`
5. TOC data is created with helpers in `src/lib/markdown.ts`

### Admin create post flow

1. Admin visits `/admin/blog/new`
2. Form renders with `src/components/admin/post-form.tsx`
3. Form submits to `createPostAction`
4. `createPostAction` validates with Zod and checks admin auth
5. Mutation is written through `insertPost`
6. Public and admin pages are revalidated
7. User is redirected back to `/admin`

## File guide

### `src/app`

- page files are route entry points
- `layout.tsx` provides fonts, providers, header, footer, and skip link
- admin routes are protected by `src/app/admin/layout.tsx`

### `src/components/layout`

- `header.tsx` renders the nav, auth controls, and theme toggle
- `footer.tsx` renders footer links
- `auth-controls.tsx` handles client-side sign-in/sign-out buttons
- `mobile-menu.tsx` handles small-screen nav

### `src/components/blog`

- `blog-card.tsx` renders blog cards for lists
- `blog-list.tsx` renders a grid of cards
- `post-content.tsx` renders markdown
- `table-of-contents.tsx` renders sidebar nav for headings
- `code-block.tsx` renders highlighted code blocks with copy button

### `src/components/admin`

- `post-form.tsx` is shared by create and edit pages
- `slug-sync.tsx` keeps the slug in sync with the title until manually edited
- `delete-button.tsx` posts to the delete action

### `src/lib`

- `env.ts` validates environment variables with Zod
- `db.ts` creates the LibSQL client and Drizzle instance
- `auth.ts` defines NextAuth behavior
- `markdown.ts` contains markdown-related helpers like TOC extraction and code highlighting setup
- `metadata.ts` keeps metadata generation consistent
- `utils.ts` contains small app-wide helpers
- `site.ts` contains brand/profile content used across pages

### `src/server/queries`

This is the server-only DAL.

Rules for this layer:

- page code should not contain raw database queries
- write and read logic should be centralized here
- public read helpers and admin read helpers are kept separate by intent

### `src/server/actions`

Every mutation lives here.

Current responsibilities:

- require admin auth
- validate form input
- call query helpers
- revalidate affected pages
- redirect after success

## Database notes

### Why LibSQL here?

The site needs to be Vercel-friendly.

Using LibSQL/Turso means:

- local development can still use `file:./local.db`
- production can point to a hosted LibSQL database
- app code mostly stays the same across environments

### Migration strategy

The repo includes a simple SQL migration in `drizzle/migrations/0000_initial.sql`.

`bun run db:migrate` runs `drizzle/migrate.ts`, which applies that SQL directly.

## Auth notes

This is intentionally a single-admin app.

There is no public registration system.

Why that matters:

- simpler data model
- simpler security surface
- easier deployment and maintenance

## SEO implementation

SEO is spread across a few places:

- `src/lib/metadata.ts` for reusable page metadata generation
- route-level metadata exports in page files
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/feed.xml/route.ts`

## Where to make common changes

### Add a new project

Edit:

- `content/projects.ts`

### Change your bio or links

Edit:

- `src/lib/site.ts`

### Change blog schema

Edit:

- `drizzle/schema.ts`
- create/update migration SQL
- query and action files if needed

### Change design system colors or typography

Edit:

- `src/app/globals.css`
- `src/app/layout.tsx`

### Change admin auth behavior

Edit:

- `src/lib/auth.ts`
- `src/app/admin/layout.tsx`

## Important practical note

This codebase uses a small build-time fallback for environment variables in development/build collection so Next.js can statically analyze routes without crashing before deployment secrets exist.

For real deployments, you still need to set the actual values.

## Suggested future improvements

- add post pagination and category filtering
- add richer markdown sanitization pipeline if you want fully user-generated content support
- add integration tests for auth and admin mutations
- move static projects into a CMS or database if they become more dynamic
