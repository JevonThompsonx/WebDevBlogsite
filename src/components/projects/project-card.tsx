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
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_8%,rgba(17,0,28,0.18)_100%)] opacity-90" />
        {project.image ? (
          <Image
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={project.image}
          />
        ) : null}
      </div>

      <div className="space-y-5 p-6 sm:p-7">
        <div className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-[1.8rem] leading-[1.02] text-[var(--color-foreground)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[var(--color-accent-strong)]">
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
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            href={`/projects/${project.slug}`}
          >
            Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {project.liveUrl ? (
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
