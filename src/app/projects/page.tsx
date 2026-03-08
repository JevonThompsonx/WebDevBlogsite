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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="space-y-5">
        <p className="section-eyebrow">Projects</p>
        <h1 className="section-title max-w-4xl">
          A growing portfolio of practical builds and learning milestones.
        </h1>
        <p className="section-copy">
          From client work to API experiments, these projects show how I think
          through interface design, implementation details, and user needs.
        </p>
      </section>

      <ProjectGrid projects={projects} />
    </div>
  );
}
