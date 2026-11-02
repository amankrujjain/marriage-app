import type { MetadataRoute } from 'next';
import { listBlogSitemapEntries } from '@/lib/blogApi';
import { PUBLIC_ROUTES, PUBLISHED_SPOKE_PATHS, SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

/** Sitemap = indexable static routes + published blog posts (when API is up). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((path) => {
    const isHome = path === '/';
    const isSpoke = PUBLISHED_SPOKE_PATHS.has(path);
    const isBlogIndex = path === '/blog/';
    return {
      url: new URL(path, SITE_URL).href,
      lastModified: now,
      changeFrequency: isHome ? 'weekly' : isBlogIndex ? 'daily' : 'monthly',
      priority: isHome ? 1 : isSpoke ? 0.8 : isBlogIndex ? 0.75 : 0.7,
    };
  });

  try {
    const posts = await listBlogSitemapEntries(3600);
    for (const post of posts) {
      entries.push({
        url: new URL(`/blog/${post.slug}/`, SITE_URL).href,
        lastModified: post.lastModified || now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // API outage — still return static marketing routes
  }

  return entries;
}
