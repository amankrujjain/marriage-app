import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, PUBLISHED_SPOKE_PATHS, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

/** Sitemap = indexable public URLs only (see PUBLIC_ROUTES + INDEXABLE_ROBOTS). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();
  return PUBLIC_ROUTES.map((path) => {
    const isHome = path === '/';
    const isSpoke = PUBLISHED_SPOKE_PATHS.has(path);
    return {
      url: new URL(path, SITE_URL).href,
      lastModified,
      changeFrequency: isHome ? 'weekly' : 'monthly',
      priority: isHome ? 1 : isSpoke ? 0.8 : 0.7,
    };
  });
}
