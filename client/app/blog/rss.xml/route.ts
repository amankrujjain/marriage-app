import { listPublicBlogPosts } from '@/lib/blogApi';
import { SITE_URL, absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let itemsXml = '';
  try {
    const { items } = await listPublicBlogPosts({
      page: 1,
      limit: 50,
      revalidate: 3600,
    });
    itemsXml = items
      .map((post) => {
        const link = absoluteUrl(`/blog/${post.slug}/`);
        return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid>${escapeXml(link)}</guid>
  <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(post.excerpt || post.title)}</description>
</item>`;
      })
      .join('\n');
  } catch {
    itemsXml = '';
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>MarriageBio Blog</title>
  <link>${SITE_URL}/blog/</link>
  <description>Guides and tips for marriage biodata.</description>
  <language>en-in</language>
${itemsXml}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
