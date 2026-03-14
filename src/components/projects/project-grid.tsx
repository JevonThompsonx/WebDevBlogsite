import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="surface-panel px-6 py-12 text-center">
        <p className="section-eyebrow mx-auto w-fit">Projects incoming</p>
        <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-[var(--color-muted)]">
          No projects are listed yet, but the workshop is definitely not empty.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
