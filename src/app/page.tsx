import Link from "next/link";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  NotebookText,
  ServerCog,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { ThemePortrait } from "@/components/theme-portrait";
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

const focusAreas = [
  {
    icon: ServerCog,
    title: "Operational systems",
    copy: "Linux hosts, self-hosted services, remote access, and infrastructure that stays calm under real use.",
  },
  {
    icon: NotebookText,
    title: "Useful documentation",
    copy: "Notes, handoff material, and post-build writeups that explain both the setup and the tradeoffs.",
  },
  {
    icon: Sparkles,
    title: "Polished software craft",
    copy: "Frontend detail and full-stack delivery still matter, especially when clarity makes technical work easier to trust.",
  },
];

const workingStyle = [
  "I like systems that feel boring in the best possible way: stable, documented, and easy to recover.",
  "I write about the process so the finished work feels explainable instead of mysterious.",
  "I keep room for experimentation, but I want the final result to feel deliberate and dependable.",
];

const socialLinks = [
  {
    href: `mailto:${siteConfig.email}`,
    label: siteConfig.email,
    icon: Mail,
  },
  {
    href: siteConfig.github,
    label: "GitHub",
    icon: Github,
  },
  {
    href: siteConfig.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
  },
];

export default async function HomePage() {
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(3),
    getLatestPublishedPosts(3),
  ]);

  return (
    <div className="site-container flex w-full flex-col gap-20 py-8 pb-16 sm:py-10 lg:gap-24 lg:pb-20">
      <section className="surface-panel grid gap-10 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-start lg:gap-12 lg:px-10 lg:py-10">
        <div className="relative z-10 space-y-8 lg:pt-2">
          <div className="space-y-5">
            <p className="section-eyebrow">Systems + software</p>
            <h1 className="section-title max-w-5xl">
              Infrastructure-minded work with a web builder&apos;s eye for
              polish.
            </h1>
            <p className="section-copy">
              I&apos;m Jevon Thompson, a systems administrator who likes Linux,
              self-hosted tooling, practical documentation, and thoughtful
              delivery. This site doubles as a portfolio and a running notebook
              for the work behind the curtain.
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

          <div className="flex flex-wrap gap-3">
            <span className="info-chip">Self-hosted infrastructure</span>
            <span className="info-chip">Documentation-first delivery</span>
            <span className="info-chip">Frontend and full-stack builds</span>
          </div>

          <div className="grid gap-4 sm:auto-rows-fr sm:grid-cols-3">
            <div className="surface-tile h-full p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Featured work
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-foreground)]">
                {featuredProjects.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-foreground-soft)]">
                Handpicked builds with infrastructure, product, or delivery
                lessons.
              </p>
            </div>

            <div className="surface-tile h-full p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Fresh notes
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-foreground)]">
                {latestPosts.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-foreground-soft)]">
                Recent posts on systems, software, and the fixes hiding between
                them.
              </p>
            </div>

            <div className="surface-tile h-full p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Current mode
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                Calm systems
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-foreground-soft)]">
                Building things that feel grounded, useful, and easy to explain.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-0 grid w-full gap-5 lg:ml-auto lg:w-[32rem]">
          <ThemePortrait
            alt="Portrait of Jevon Thompson"
            className="max-w-[21rem] sm:max-w-[24rem] lg:max-w-none"
            priority
            sizes="(max-width: 640px) 21rem, (max-width: 1024px) 24rem, 32rem"
          />

          <div className="grid auto-rows-fr gap-4">
            {focusAreas.map((item) => {
              const Icon = item.icon;

              return (
                <div className="surface-tile h-full p-5" key={item.title}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_76%,white_24%)] p-3 text-[var(--color-accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-foreground)]">
                        {item.title}
                      </h2>
                      <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="section-eyebrow">Featured projects</p>
            <h2 className="section-title max-w-4xl text-[clamp(2.2rem,3.6vw,4rem)]">
              Practical builds with real systems energy behind them.
            </h2>
            <p className="section-copy">
              A mix of shipped portfolio work, technical experiments, and
              self-directed builds that show how I think about interfaces,
              implementation, and maintenance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="info-chip">
              {featuredProjects.length} highlighted projects
            </span>
            <Link className="section-link" href="/projects">
              See all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ProjectGrid projects={featuredProjects} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <div className="space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="section-eyebrow">Latest posts</p>
              <h2 className="section-title max-w-4xl text-[clamp(2.2rem,3.6vw,4rem)]">
                Notes from the lab, the browser, and the parts in between.
              </h2>
              <p className="section-copy">
                I write about systems decisions, software details, and the
                little lessons that only show up after building or maintaining
                something.
              </p>
            </div>

            <Link className="section-link" href="/blog">
              Browse the blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <BlogList posts={latestPosts} />
        </div>

        <aside className="surface-panel space-y-5 p-6 sm:p-7 xl:sticky xl:top-28">
          <div className="space-y-3">
            <p className="section-eyebrow">How I like to work</p>
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.8vw,2.5rem)] leading-[0.96] text-[var(--color-foreground)]">
              Clear thinking, useful artifacts, and a little charm.
            </h3>
          </div>

          <div className="grid gap-3">
            {workingStyle.map((item) => (
              <div className="surface-tile p-4" key={item}>
                <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.6rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] p-4">
            <div className="flex items-center gap-3 text-[var(--color-foreground)]">
              <Waypoints className="h-4 w-4 text-[var(--color-accent)]" />
              <p className="text-sm font-semibold">
                Good work should be easy to follow.
              </p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--color-foreground-soft)]">
              That means stronger IA, better documentation, and interfaces that
              point people toward the next sensible move.
            </p>
          </div>
        </aside>
      </section>

      <section className="surface-panel grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start lg:px-10">
        <div className="space-y-5">
          <p className="section-eyebrow">About</p>
          <h2 className="section-title max-w-4xl text-[clamp(2.2rem,3.6vw,4rem)]">
            Curiosity turned into systems work, self-hosting, and software that
            still feels human.
          </h2>
          <p className="section-copy">{aboutContent.short}</p>
          <Link className={buttonClasses("secondary", "md")} href="/about">
            More about me
          </Link>
        </div>

        <div className="grid gap-4">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            const isExternal = !item.href.startsWith("mailto:");

            return (
              <a
                className="surface-tile flex items-center justify-between gap-4 p-4"
                href={item.href}
                key={item.href}
                rel={isExternal ? "noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-[1rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_76%,white_24%)] p-2.5 text-[var(--color-accent)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {item.label}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--color-accent)]" />
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
