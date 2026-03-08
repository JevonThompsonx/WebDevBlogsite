import { publicEnv } from "@/lib/env";
import { getPublishedPosts } from "@/server/queries/posts";

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Jevon Thompson Blog</title>
    <link>${publicEnv.NEXT_PUBLIC_APP_URL}</link>
    <description>Technical notes and portfolio updates from Jevon Thompson.</description>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${publicEnv.NEXT_PUBLIC_APP_URL}/blog/${post.slug}</link>
      <guid>${publicEnv.NEXT_PUBLIC_APP_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
