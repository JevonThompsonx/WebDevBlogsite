import { describe, expect, it } from "vitest";
import { estimateReadingTime, slugify, truncate } from "@/lib/utils";
import { extractTableOfContents } from "@/lib/markdown";

describe("slugify", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("My First Post!")).toBe("my-first-post");
  });
});

describe("truncate", () => {
  it("adds an ellipsis when content is longer than the limit", () => {
    expect(truncate("abcdef", 5)).toBe("abcd...");
  });
});

describe("estimateReadingTime", () => {
  it("returns at least one minute", () => {
    expect(estimateReadingTime("tiny post")).toBe(1);
  });
});

describe("extractTableOfContents", () => {
  it("pulls h2 and h3 headings from markdown", () => {
    const items = extractTableOfContents(
      "# Intro\n\n## Section One\n\n### Deep Dive\n\n```ts\n## ignored\n```",
    );

    expect(items).toEqual([
      { level: 2, text: "Section One", slug: "section-one" },
      { level: 3, text: "Deep Dive", slug: "deep-dive" },
    ]);
  });
});
