import { GALLERY_TEMPLATES } from '@/features/templates/gallery/galleryCatalog';
import { spokePages } from '@/content/spokes';
import type { SpokeHub, SpokePageConfig } from '@/content/spokes/types';

export type FormatsNavLink = {
  label: string;
  href: string;
  desc: string;
  lang?: 'hi' | 'mr';
  descLang?: 'hi' | 'mr';
};

export type FormatsNavHub = {
  id: string;
  label: string;
  links: FormatsNavLink[];
};

export type DesignShortcut = {
  slug: string;
  name: string;
  tier: 'Free' | 'Premium';
};

/** Launch mega/drawer: live routes only until spokes publish. */
export const LAUNCH_HUBS: FormatsNavHub[] = [
  {
    id: 'start',
    label: 'Start here',
    links: [
      {
        label: 'Create biodata',
        href: '/',
        desc: 'Free Biodata for Marriage Maker',
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    links: [
      {
        label: 'Designs',
        href: '/templates/',
        desc: 'Marriage Biodata Templates',
      },
    ],
  },
];

const DESIGN_SHORTCUT_SLUGS = [
  'zari-traditional',
  'gulab-floral',
  'kagaz-modern',
  'panna-royal',
  'aarohi-modern',
] as const;

const HUB_META: Array<{ hub: SpokeHub; id: string; label: string }> = [
  { hub: 'Templates', id: 'templates', label: 'Templates' },
  { hub: 'Formats', id: 'formats', label: 'Formats' },
  { hub: 'Boy and girl', id: 'boy-girl', label: 'Boy & girl' },
  { hub: 'Communities', id: 'communities', label: 'Communities' },
  { hub: 'Languages', id: 'languages', label: 'Languages' },
  { hub: 'Guides', id: 'guides', label: 'Guides' },
];

function sentenceCase(value: string): string {
  const t = value.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function linkFromSpoke(page: SpokePageConfig): FormatsNavLink {
  const desc = page.h1.includes('TODO_COPY')
    ? sentenceCase(page.primaryKeyword)
    : page.h1;
  return {
    label: page.breadcrumbName,
    href: page.path,
    desc,
    lang: page.language === 'en' ? undefined : page.language,
    descLang: page.language === 'en' ? undefined : page.language,
  };
}

/** Published spoke pages only (footer / sitemap). */
export function publishedSpokePages(): SpokePageConfig[] {
  return spokePages().filter((page) => page.published);
}

/**
 * Mega + drawer hubs from every spoke page (including unpublished drafts),
 * so newly created routes show while copy/publish is still pending.
 * Footer formats column still uses published only.
 */
export function getFormatsNavHubs(): {
  isLaunch: boolean;
  hubs: FormatsNavHub[];
} {
  const pages = spokePages();
  if (pages.length === 0) {
    return { isLaunch: true, hubs: LAUNCH_HUBS };
  }

  const byHub = new Map<SpokeHub, SpokePageConfig[]>();
  for (const page of pages) {
    const list = byHub.get(page.hub) ?? [];
    list.push(page);
    byHub.set(page.hub, list);
  }

  const hubs: FormatsNavHub[] = [];
  for (const meta of HUB_META) {
    if (meta.hub === 'Templates') {
      hubs.push({
        id: meta.id,
        label: meta.label,
        links: [
          {
            label: 'Designs',
            href: '/templates/',
            desc: 'Marriage Biodata Templates',
          },
        ],
      });
      continue;
    }
    const hubPages = byHub.get(meta.hub);
    if (!hubPages?.length) continue;
    hubs.push({
      id: meta.id,
      label: meta.label,
      links: hubPages.map(linkFromSpoke),
    });
  }

  return { isLaunch: false, hubs };
}

export function getDesignShortcuts(): DesignShortcut[] {
  return DESIGN_SHORTCUT_SLUGS.map((slug) => {
    const template = GALLERY_TEMPLATES.find((t) => t.slug === slug);
    return {
      slug,
      name: template?.name ?? slug,
      tier: template?.tier === 'Premium' ? 'Premium' : 'Free',
    };
  });
}

/** Flat published spoke links for the footer formats column. */
export function getFooterFormatLinks(): FormatsNavLink[] {
  return publishedSpokePages().map(linkFromSpoke);
}
