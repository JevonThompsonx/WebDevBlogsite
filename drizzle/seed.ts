import { count, eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { posts } from "./schema";

const now = new Date().toISOString();

const examplePosts = [
  {
    title: "Rebuilding My Portfolio for a Better First Impression",
    slug: "rebuilding-my-portfolio-for-a-better-first-impression",
    excerpt:
      "Why I rebuilt my portfolio to better reflect the way I think about systems, frontend quality, and long-term maintainability.",
    category: "Career",
    published: true,
    createdAt: now,
    updatedAt: now,
    coverImage: "/images/mySite.webp",
    content: `# Rebuilding the site\n\nMy original portfolio got the job done, but it no longer represented how I want to build software.\n\n## What changed\n\n- Better information architecture\n- Stronger writing presentation\n- A real content workflow\n\n## A systems mindset\n\nI enjoy work that sits between user experience and reliability. A portfolio should show both.\n\n\`\`\`ts\nexport function introduce(name: string): string {\n  return \`Hi, I'm ${name}.\`;\n}\n\`\`\`\n`,
  },
  {
    title: "Drafting Content Before It Ships",
    slug: "drafting-content-before-it-ships",
    excerpt:
      "A quick look at how I use drafts to shape technical writing before it is ready for public readers.",
    category: "Writing",
    published: false,
    createdAt: now,
    updatedAt: now,
    coverImage: "/images/proj-dict.webp",
    content: `# Writing in drafts\n\nDrafts help me think in public without publishing too early.\n\n## Why drafts matter\n\nThey make it easier to refine structure, examples, and tone before a post goes live.`,
  },
];

async function seed(): Promise<void> {
  const existing = await db.select({ value: count() }).from(posts);
  const postCount = existing[0]?.value ?? 0;

  if (postCount > 0) {
    console.log("Seed skipped: posts already exist.");
    return;
  }

  await db.insert(posts).values(examplePosts);

  const publishedPost = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(
      eq(posts.slug, "rebuilding-my-portfolio-for-a-better-first-impression"),
    );

  console.log(`Seed complete: ${publishedPost.length} sample post verified.`);
}

seed();
