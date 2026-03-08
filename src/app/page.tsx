import Link from "next/link";
import { ThemePortrait } from "@/components/theme-portrait";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { BlogList } from "@/components/blog/blog-list";
import { ProjectGrid } from "@/components/projects/project-grid";
import { buttonClasses } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { aboutContent, siteConfig } from "@/lib/site";
import { getLatestPublishedPosts } from "@/server/queries/posts";
import { getFeaturedProjects } from "@/server/queries/projects";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(3),
    getLatestPublishedPosts(3),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-end">
        <div className="space-y-8">
          <p className="section-eyebrow">Systems + software</p>
          <div className="space-y-6">
            <h1 className="section-title max-w-4xl">
              Systems administration first, with a strong web development
              foundation.
            </h1>
            <p className="section-copy">
              I&apos;m Jevon Thompson, a systems administrator who enjoys Linux,
              self-hosted infrastructure, documentation, and dependable
              delivery. I still build web apps and frontend experiments, but my
              current focus is operating useful systems and showing the work
              behind them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonClasses("primary", "lg")} href="/projects">
              View Projects
            </Link>
            <Link className={buttonClasses("secondary", "lg")} href="/blog">
              Read Blog
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <ThemePortrait
            alt="Portrait of Jevon Thompson"
            className="max-w-[22rem] sm:max-w-[24rem] lg:ml-auto lg:max-w-[27rem]"
            priority
            sizes="(max-width: 640px) 22rem, (max-width: 1024px) 24rem, 27rem"
          />
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
            <p className="section-eyebrow">What this site shows</p>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-[var(--color-foreground-soft)]">
              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_78%,white_22%)] p-4">
                Self-hosted and operational work across Linux, virtualization,
                containers, and secure remote access.
              </div>
              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_78%,white_22%)] p-4">
                Portfolio projects that still reflect my web development
                background, from frontend builds to full-stack rewrites.
              </div>
              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_78%,white_22%)] p-4">
                Writing about systems, tradeoffs, learning, and the practical
                work behind the tools I run.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="section-eyebrow">Featured projects</p>
            <h2 className="section-title text-[clamp(2rem,3vw,3.4rem)]">
              Infrastructure, self-hosting, and the projects that support the
              journey.
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]"
            href="/projects"
          >
            See all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProjectGrid projects={featuredProjects} />
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="section-eyebrow">Latest posts</p>
            <h2 className="section-title text-[clamp(2rem,3vw,3.4rem)]">
              Notes on systems, software, and continuous improvement.
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]"
            href="/blog"
          >
            Browse the blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <BlogList posts={latestPosts} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start">
        <div className="space-y-4">
          <p className="section-eyebrow">About</p>
          <h2 className="section-title text-[clamp(2rem,3vw,3.4rem)]">
            Curiosity grew into systems work, self-hosting, and software craft.
          </h2>
          <p className="section-copy">{aboutContent.short}</p>
          <Link className={buttonClasses("secondary", "md")} href="/about">
            More about me
          </Link>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
          <p className="section-eyebrow">Contact</p>
          <div className="mt-5 grid gap-4 text-sm text-[var(--color-foreground-soft)]">
            <a
              className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--color-border)] px-4 py-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              href={`mailto:${siteConfig.email}`}
            >
              <Mail className="h-4 w-4" />
              {siteConfig.email}
            </a>
            <a
              className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--color-border)] px-4 py-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              href={siteConfig.github}
              rel="noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--color-border)] px-4 py-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              href={siteConfig.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
