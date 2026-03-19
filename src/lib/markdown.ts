import { cache } from "react";
import { createHighlighter } from "shiki";
import { slugify } from "@/lib/utils";
import type { TableOfContentsItem } from "@/types";

const supportedLanguages = [
  "plaintext",
  "text",
  "bash",
  "shell",
  "sh",
  "javascript",
  "js",
  "typescript",
  "ts",
  "tsx",
  "jsx",
  "json",
  "html",
  "css",
  "sql",
  "yaml",
  "yml",
  "md",
  "markdown",
] as const;

function stripMarkdownSyntax(input: string): string {
  return input
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[>*_~]/g, "")
    .trim();
}

export function createHeadingSlugger(): (text: string) => string {
  const counts = new Map<string, number>();

  return (text: string) => {
    const baseSlug = slugify(stripMarkdownSyntax(text)) || "section";
    const currentCount = counts.get(baseSlug) ?? 0;
    const nextCount = currentCount + 1;
    counts.set(baseSlug, nextCount);

    if (currentCount === 0) {
      return baseSlug;
    }

    return `${baseSlug}-${nextCount}`;
  };
}

export function extractTableOfContents(
  markdown: string,
): TableOfContentsItem[] {
  const slugForHeading = createHeadingSlugger();
  const lines = markdown.split("\n");
  const items: TableOfContentsItem[] = [];
  let insideCodeBlock = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }

    if (insideCodeBlock) {
      continue;
    }

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());

    if (!match) {
      continue;
    }

    const headingText = stripMarkdownSyntax(match[2] ?? "");

    items.push({
      level: (match[1] ?? "").length,
      text: headingText,
      slug: slugForHeading(headingText),
    });
  }

  return items;
}

export function resolveCodeLanguage(className?: string): string {
  if (!className) {
    return "plaintext";
  }

  const match = /language-([a-z0-9#+-]+)/i.exec(className);
  const language = match?.[1]?.toLowerCase() ?? "plaintext";

  if (supportedLanguages.some((item) => item === language)) {
    return language;
  }

  return "plaintext";
}

export const getCodeHighlighter = cache(async () =>
  createHighlighter({
    themes: ["vitesse-dark"],
    langs: [...supportedLanguages],
  }),
);
