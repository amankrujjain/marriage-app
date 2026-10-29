import type { Metadata } from 'next';

export const SITE_URL = 'https://marriagebio.in';

/** Public marketing + tool routes (trailingSlash). Extend when spokes launch. */
export const PUBLIC_ROUTES = [
  '/',
  '/templates/',
  '/privacy/',
  '/wedding-pass/',
  // Future language spokes (listed for helpers; add pages before sitemap include)
  // '/hi/',
  // '/marathi-biodata/',
] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

/** hreflang map ready for /hi/ and /marathi-biodata/. */
export function languageAlternates(path: string = '/'): Metadata['alternates'] {
  const normalized = path.endsWith('/') || path === '/' ? path : `${path}/`;
  const base = normalized === '/' ? '/' : normalized;
  return {
    canonical: base,
    languages: {
      'en-IN': base,
      'hi-IN': '/hi/',
      'mr-IN': '/marathi-biodata/',
      'x-default': base,
    },
  };
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return new URL(p, SITE_URL).toString();
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MarriageBio',
    url: SITE_URL,
    logo: absoluteUrl('/favicon.ico'),
  };
}

export function softwareApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MarriageBio Free Marriage Biodata Maker',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };
}
