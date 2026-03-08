import "server-only";

import { projects } from "../../../content/projects";
import type { Project } from "@/types";

function sortProjects(items: Project[]): Project[] {
  return [...items].sort((left, right) => left.order - right.order);
}

export async function getProjects(): Promise<Project[]> {
  return sortProjects(projects);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return sortProjects(projects.filter((project) => project.featured)).slice(
    0,
    limit,
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const project = projects.find((item) => item.slug === slug);
  return project ?? null;
}
