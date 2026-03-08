export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  highlights?: string[];
  accessNote?: string;
  resourceLinks?: Array<{
    label: string;
    url: string;
  }>;
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  featured: boolean;
  order: number;
}

export interface TableOfContentsItem {
  level: number;
  text: string;
  slug: string;
}

export interface PostRecord {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActionState {
  status: "idle" | "error";
  message: string;
  fieldErrors: Record<string, string>;
}

export const initialActionState: ActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
