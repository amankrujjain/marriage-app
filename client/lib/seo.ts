import type { Metadata } from 'next';
import { publishedPages } from '@/content/spokes';

export const SITE_URL = 'https://marriagebio.in';

const STATIC_PUBLIC_ROUTES = [
  '/',
  '/templates/',
  '/privacy/',
  '/wedding-pass/',
] as const;

/** Language hreflang cluster paths (only when each is in PUBLIC_ROUTES). */
const LANGUAGE_CLUSTER = {
  'en-IN': '/',
  'hi-IN': '/hi/',
  'mr-IN': '/marathi-biodata/',
  'x-default': '/',
} as const;

const LANGUAGE_CLUSTER_PATHS = new Set<string>([
  '/',
  '/hi/',
  '/marathi-biodata/',
]);

function dedupePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const path of paths) {
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(path);
  }
  return out;
}

/** Public marketing + tool routes (trailingSlash), including published spokes. */
export const PUBLIC_ROUTES: string[] = dedupePaths([
  ...STATIC_PUBLIC_ROUTES,
  ...publishedPages().map((page) => page.path),
]);

export type PublicRoute = (typeof STATIC_PUBLIC_ROUTES)[number] | string;

const EXISTING_ROUTES = new Set<string>(PUBLIC_ROUTES);

/** Published spoke paths (kind === 'spoke') for sitemap priority. */
export const PUBLISHED_SPOKE_PATHS = new Set(
  publishedPages()
    .filter((page) => page.kind === 'spoke')
    .map((page) => page.path),
);

function normalizePath(path: string): string {
  if (path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Canonical is always the page's own path.
 * hreflang cluster only for `/`, `/hi/`, `/marathi-biodata/` (each only if in PUBLIC_ROUTES).
 * Every other page: en-IN + x-default → self.
 */
export function languageAlternates(path: string = '/'): Metadata['alternates'] {
  const self = normalizePath(path);

  if (LANGUAGE_CLUSTER_PATHS.has(self)) {
    const languages: Record<string, string> = {};
    for (const [hreflang, spokePath] of Object.entries(LANGUAGE_CLUSTER)) {
      if (EXISTING_ROUTES.has(spokePath)) {
        languages[hreflang] = spokePath;
      }
    }
    if (!languages['x-default']) {
      languages['x-default'] = self;
    }
    if (!languages['en-IN']) {
      languages['en-IN'] = self;
    }
    return {
      canonical: self,
      languages,
    };
  }

  return {
    canonical: self,
    languages: {
      'en-IN': self,
      'x-default': self,
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
