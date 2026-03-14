import { Download, Github, Linkedin, Mail } from "lucide-react";
import { ThemePortrait } from "@/components/theme-portrait";
import { buildMetadata } from "@/lib/metadata";
import { aboutContent, siteConfig, skillGroups } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About | Jevon Thompson",
  description:
    "Learn about Jevon Thompson's background in systems administration, self-hosted infrastructure, and continuing web development work.",
  path: "/about",
  image: "/images/Me-modified.webp",
});

const profileLinks = [
  {
    href: `mailto:${siteConfig.email}`,
    label: "Email",
    value: siteConfig.email,
    icon: Mail,
  },
  {
    href: siteConfig.github,
    label: "GitHub",
    value: "JevonThompsonx",
    icon: Github,
  },
  {
    href: siteConfig.linkedin,
    label: "LinkedIn",
    value: "Professional profile",
    icon: Linkedin,
  },
];

export default function AboutPage() {
  return (
    <div className="site-container flex w-full flex-col gap-14 py-8 pb-16 sm:py-10 lg:gap-16 lg:pb-20">
      <section className="surface-panel grid gap-10 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(18rem,23rem)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:px-10">
        <div className="relative z-0 lg:pr-4 xl:pr-6">
          <ThemePortrait
            alt="Portrait of Jevon Thompson"
            className="max-w-[20rem] sm:max-w-[22rem] lg:mx-0 lg:max-w-[23rem]"
            priority
          />
        </div>

        <div className="relative z-10 space-y-8 lg:pt-3">
          <div className="space-y-5">
            <p className="section-eyebrow">About me</p>
            <h1 className="section-title max-w-4xl">
              Hands-on systems work, with web development still close at hand.
            </h1>
            <p className="section-copy">{aboutContent.resumeSummary}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-tile p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                What I value
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-foreground-soft)]">
                Reliability, clarity, patient troubleshooting, and technical
                work that leaves behind better documentation than it started
                with.
              </p>
            </div>
            <div className="surface-tile p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Current focus
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                Self-hosting + ops
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="surface-tile p-6 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.8vw,2.5rem)] text-[var(--color-foreground)]">
            Background
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-foreground-soft)]">
            {aboutContent.background}
          </p>
        </div>

        <div className="surface-tile p-6 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.8vw,2.5rem)] text-[var(--color-foreground)]">
            Why I still build software
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-foreground-soft)]">
            {aboutContent.whyCode}
          </p>
        </div>

        <div className="surface-tile p-6 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.8vw,2.5rem)] text-[var(--color-foreground)]">
            Why hire me
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-foreground-soft)]">
            {aboutContent.whyHire}
          </p>
        </div>

        <div className="surface-tile p-6 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.8vw,2.5rem)] text-[var(--color-foreground)]">
            Resume and learning
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-foreground-soft)]">
            I keep refining my craft through projects, experimentation, and
            documented learning. My public notes and portfolio work are part of
            that process.
          </p>
          <a
            className="section-link mt-5"
            href={siteConfig.notion}
            rel="noreferrer"
            target="_blank"
          >
            <Download className="h-4 w-4" />
            View learning notes
          </a>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <p className="section-eyebrow">Skills</p>
          <h2 className="section-title text-[clamp(2.2rem,3.6vw,4rem)]">
            A working mix of infrastructure, operations, and development
            experience.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div className="surface-panel p-6 sm:p-7" key={group.title}>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                {group.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <span
                    className="rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] px-3.5 py-2 text-sm text-[var(--color-foreground-soft)]"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="section-eyebrow">Contact</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,3vw,3rem)] leading-[0.96] text-[var(--color-foreground)]">
              Reach out if you need someone who likes both the infrastructure
              and the explanation.
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {profileLinks.map((item) => {
            const Icon = item.icon;
            const isExternal = !item.href.startsWith("mailto:");

            return (
              <a
                className="surface-tile flex items-center gap-4 p-4"
                href={item.href}
                key={item.href}
                rel={isExternal ? "noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
              >
                <span className="rounded-[1rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_76%,white_24%)] p-3 text-[var(--color-accent)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[var(--color-foreground)]">
                    {item.value}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
