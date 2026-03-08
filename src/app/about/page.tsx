import Image from "next/image";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { aboutContent, siteConfig, skillGroups } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About | Jevon Thompson",
  description:
    "Learn about Jevon Thompson's background in systems administration, self-hosted infrastructure, and continuing web development work.",
  path: "/about",
  image: "/images/Me-modified.webp",
});

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
          <Image
            alt="Portrait of Jevon Thompson"
            className="h-full w-full object-cover"
            height={900}
            priority
            src="/images/Me-modified.webp"
            width={720}
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="section-eyebrow">About me</p>
            <h1 className="section-title max-w-4xl">
              Hands-on systems work, with web development still in the toolkit.
            </h1>
            <p className="section-copy">{aboutContent.resumeSummary}</p>
          </div>

          <div className="grid gap-6 text-[var(--color-foreground-soft)] md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                Background
              </h2>
              <p className="mt-4 leading-8">{aboutContent.background}</p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                Why I still build software
              </h2>
              <p className="mt-4 leading-8">{aboutContent.whyCode}</p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                Why hire me
              </h2>
              <p className="mt-4 leading-8">{aboutContent.whyHire}</p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                Resume and learning
              </h2>
              <p className="mt-4 leading-8">
                I keep refining my craft through projects, experimentation, and
                documented learning. My public notes and portfolio work are part
                of that process.
              </p>
              <a
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]"
                href={siteConfig.notion}
                rel="noreferrer"
                target="_blank"
              >
                <Download className="h-4 w-4" />
                View learning notes
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <p className="section-eyebrow">Skills</p>
          <h2 className="section-title text-[clamp(2rem,3vw,3.4rem)]">
            A mix of infrastructure, operations, and development experience.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              className="rounded-[1.75rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-6 shadow-[var(--shadow-soft)]"
              key={group.title}
            >
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foreground)]">
                {group.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-foreground-soft)]"
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

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,white_12%)] p-8 shadow-[var(--shadow-soft)]">
        <p className="section-eyebrow">Contact</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <a
            className="flex items-center gap-3 rounded-[1.5rem] border border-[var(--color-border)] px-5 py-4 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            href={`mailto:${siteConfig.email}`}
          >
            <Mail className="h-5 w-5" />
            Email
          </a>
          <a
            className="flex items-center gap-3 rounded-[1.5rem] border border-[var(--color-border)] px-5 py-4 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            href={siteConfig.github}
            rel="noreferrer"
            target="_blank"
          >
            <Github className="h-5 w-5" />
            GitHub
          </a>
          <a
            className="flex items-center gap-3 rounded-[1.5rem] border border-[var(--color-border)] px-5 py-4 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            href={siteConfig.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            <Linkedin className="h-5 w-5" />
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
