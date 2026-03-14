import { BriefcaseBusiness, Layers3 } from "lucide-react";
import { ProjectGrid } from "@/components/projects/project-grid";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/server/queries/projects";

export const metadata = buildMetadata({
  title: "Projects | Jevon Thompson",
  description:
    "A collection of portfolio projects spanning frontend craft, API work, client delivery, and developer tooling.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="site-container flex w-full flex-col gap-12 py-8 pb-16 sm:py-10 lg:gap-14 lg:pb-20">
      <section className="surface-panel grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:px-10">
        <div className="space-y-5">
          <p className="section-eyebrow">Projects</p>
          <h1 className="section-title max-w-4xl">
            A growing body of practical builds, experiments, and learning
            milestones.
          </h1>
          <p className="section-copy">
            From client-style product work to infrastructure-adjacent
            experiments, these projects show how I think through visual polish,
            implementation details, and long-term usefulness.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="surface-tile p-5">
            <BriefcaseBusiness className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-foreground)]">
              {projects.length}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-foreground-soft)]">
              Public portfolio pieces and working proofs with a clear purpose.
            </p>
          </div>
          <div className="surface-tile p-5">
            <Layers3 className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="mt-4 text-sm leading-7 text-[var(--color-foreground-soft)]">
              Expect a mix of frontend craft, app architecture, and the sort of
              practical details that make projects easier to maintain.
            </p>
          </div>
        </div>
      </section>

      <ProjectGrid projects={projects} />
    </div>
  );
}
