import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-[color-mix(in_srgb,var(--color-surface)_74%,black_26%)]">
        {project.image ? (
          <Image
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={project.image}
          />
        ) : null}
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--color-foreground)]">
            {project.title}
          </h3>
          <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((item) => (
            <Badge key={`${project.slug}-${item}`}>{item}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            href={`/projects/${project.slug}`}
          >
            Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {project.liveUrl ? (
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              href={project.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
              Repository
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
