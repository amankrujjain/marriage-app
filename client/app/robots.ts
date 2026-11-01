import type { MetadataRoute } from 'next';
import { ROBOTS_DISALLOW, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // All marketing / spoke URLs stay allowed via Allow: /
      allow: '/',
      disallow: [...ROBOTS_DISALLOW],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
