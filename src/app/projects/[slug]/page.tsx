import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, getProjects } from "@/server/queries/projects";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Project Not Found | Jevon Thompson",
      description: "The requested project could not be found.",
      path: `/projects/${slug}`,
    });
  }

  return buildMetadata({
    title: `${project.title} | Jevon Thompson`,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.image ?? "/images/mySite.webp",
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="site-container flex w-full flex-col gap-8 py-8 pb-16 sm:py-10 lg:gap-10 lg:pb-20">
      <Link className="section-link" href="/projects">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-10">
        <section className="surface-panel space-y-6 px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
          <p className="section-eyebrow">Project detail</p>
          <h1 className="section-title max-w-4xl text-[clamp(2.8rem,5vw,5rem)]">
            {project.title}
          </h1>
          <p className="section-copy">{project.longDescription}</p>

          {project.image ? (
            <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
              <Image
                alt={project.title}
                className="h-auto w-full object-cover"
                height={720}
                priority
                src={project.image}
                width={1280}
              />
            </div>
          ) : null}
        </section>

        <aside className="surface-panel space-y-6 p-6 sm:p-7 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-3">
              <Layers3 className="h-4 w-4 text-[var(--color-accent)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                Stack
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((item) => (
                <Badge key={`${project.slug}-${item}`}>{item}</Badge>
              ))}
            </div>
          </div>

          {project.highlights && project.highlights.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                Highlights
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-foreground-soft)]">
                {project.highlights.map((item) => (
                  <li className="surface-tile px-4 py-3" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.accessNote ? (
            <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] p-4 text-sm leading-7 text-[var(--color-foreground-soft)]">
              <p className="font-medium text-[var(--color-foreground)]">
                Access note
              </p>
              <p className="mt-2">{project.accessNote}</p>
            </div>
          ) : null}

          <div className="grid gap-3 text-sm font-medium">
            {project.liveUrl ? (
              <a
                className="surface-tile inline-flex items-center justify-between px-4 py-3"
                href={project.liveUrl}
                rel="noreferrer"
                target="_blank"
              >
                Live site
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                className="surface-tile inline-flex items-center justify-between px-4 py-3"
                href={project.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                Repository
                <Github className="h-4 w-4" />
              </a>
            ) : null}
            {project.resourceLinks?.map((resource) => (
              <a
                className="surface-tile inline-flex items-center justify-between px-4 py-3"
                href={resource.url}
                key={resource.url}
                rel="noreferrer"
                target="_blank"
              >
                {resource.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
