import type { Metadata } from 'next';

export const SITE_URL = 'https://marriagebio.in';

/** Public marketing + tool routes (trailingSlash). Extend when spokes launch. */
export const PUBLIC_ROUTES = [
  '/',
  '/templates/',
  '/privacy/',
  '/wedding-pass/',
] as const;

/** Language spokes — add here when pages exist; kept out of PUBLIC_ROUTES / sitemap. */
const LANGUAGE_SPOKES = {
  'hi-IN': '/hi/',
  'mr-IN': '/marathi-biodata/',
} as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

const EXISTING_ROUTES = new Set<string>(PUBLIC_ROUTES);

/** hreflang: en-IN + x-default always; hi-IN / mr-IN only when those routes exist. */
export function languageAlternates(path: string = '/'): Metadata['alternates'] {
  const normalized = path.endsWith('/') || path === '/' ? path : `${path}/`;
  const base = normalized === '/' ? '/' : normalized;
  const languages: Record<string, string> = {
    'en-IN': base,
    'x-default': base,
  };
  for (const [hreflang, spoke] of Object.entries(LANGUAGE_SPOKES)) {
    if (EXISTING_ROUTES.has(spoke)) {
      languages[hreflang] = spoke;
    }
  }
  return {
    canonical: base,
    languages,
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
