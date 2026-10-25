import fs from 'fs';

const registryPath =
  'C:/Users/ASUS/Downloads/vivah-patra-ui-v2/vivah-patra-ui-v2/tools/registry.json';
const outPath =
  'd:/Aman/projects/upload/marriage/client/features/templates/gallery/galleryCatalog.ts';

const TemplateIdByCat = {
  Traditional: 'TemplateId.TRADITIONAL_MAROON',
  Royal: 'TemplateId.ROYAL_GOLD',
  Floral: 'TemplateId.FLORAL_SOFT',
  Modern: 'TemplateId.MODERN_CLEAN',
};

const legacy = [
  {
    slug: 'zari-traditional',
    name: 'Zari Traditional',
    tier: 'Free',
    cat: 'Traditional',
    faith: ['Hindu', 'Sikh'],
    blurb:
      'Maroon and gold zari border with rosette corners. The classic family biodata.',
    templateId: 'TemplateId.TRADITIONAL_MAROON',
  },
  {
    slug: 'panna-royal',
    name: 'Panna Royal',
    tier: 'Premium',
    cat: 'Royal',
    faith: ['Hindu', 'Muslim', 'Sikh'],
    blurb: 'Deep emerald green with a gold arch frame and lattice. Rich and formal.',
    templateId: 'TemplateId.ROYAL_GOLD',
  },
  {
    slug: 'gulab-floral',
    name: 'Gulab Floral',
    tier: 'Free',
    cat: 'Floral',
    faith: ['Hindu'],
    blurb: 'Cream page with soft rose clusters in two corners and a round photo.',
    templateId: 'TemplateId.FLORAL_SOFT',
  },
  {
    slug: 'kagaz-modern',
    name: 'Kagaz Modern',
    tier: 'Free',
    cat: 'Modern',
    faith: ['Hindu', 'Muslim', 'Sikh'],
    blurb: 'Clean white page with a side rail. Easy to read, easy on the printer.',
    templateId: 'TemplateId.MODERN_CLEAN',
  },
  {
    slug: 'suryavanshi-royal',
    name: 'Suryavanshi Royal',
    tier: 'Premium',
    cat: 'Royal',
    faith: ['Hindu'],
    blurb: 'Maroon header with a gold temple skyline and a round photo.',
    templateId: 'TemplateId.ELEGANT_SERIF',
  },
  {
    slug: 'rangoli-floral',
    name: 'Rangoli Floral',
    tier: 'Free',
    cat: 'Floral',
    faith: ['Hindu'],
    blurb: 'Warm cream with pink blossoms, a rangoli ring and an arched photo.',
    templateId: 'TemplateId.FLORAL_SOFT',
  },
  {
    slug: 'varma-traditional',
    name: 'Varma Traditional',
    tier: 'Premium',
    cat: 'Traditional',
    faith: ['Hindu', 'Sikh'],
    blurb: 'Full maroon panel inside an ornate triple gold frame.',
    templateId: 'TemplateId.TRADITIONAL_MAROON',
  },
  {
    slug: 'aarohi-modern',
    name: 'Aarohi Modern',
    tier: 'Free',
    cat: 'Modern',
    faith: ['Hindu', 'Muslim', 'Sikh'],
    blurb: 'Soft beige, a left-aligned name and tidy cards. Calm and contemporary.',
    templateId: 'TemplateId.MINIMAL_LINE',
  },
];

const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const extra = reg.map((r) => ({
  slug: r.slug,
  name: r.name,
  tier: r.tier,
  cat: r.cat,
  faith: [r.community],
  blurb: r.blurb,
  templateId: TemplateIdByCat[r.cat] || 'TemplateId.MODERN_CLEAN',
}));

const all = [...legacy, ...extra];

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function fmt(t) {
  const faith = `[${t.faith.map((f) => `'${f}'`).join(', ')}]`;
  return `  {
    slug: '${t.slug}',
    name: '${esc(t.name)}',
    tier: '${t.tier}',
    cat: '${t.cat}',
    faith: ${faith},
    blurb: '${esc(t.blurb)}',
    templateId: ${t.templateId},
  }`;
}

const out = `import { TemplateId } from '@marriage/shared';

export type GalleryStyle = 'Traditional' | 'Royal' | 'Floral' | 'Modern';
export type GalleryFaith = 'Hindu' | 'Muslim' | 'Sikh' | 'Christian';
export type GalleryTier = 'Free' | 'Premium';

export type GalleryTemplate = {
  slug: string;
  name: string;
  tier: GalleryTier;
  cat: GalleryStyle;
  faith: GalleryFaith[];
  blurb: string;
  /** Best-effort map into the current React template engine. */
  templateId: TemplateId;
};

export const GALLERY_TEMPLATES: GalleryTemplate[] = [
${all.map(fmt).join(',\n')},
];

export const STYLE_FILTERS = ['All', 'Traditional', 'Royal', 'Floral', 'Modern'] as const;
export const FAITH_FILTERS = ['Hindu', 'Muslim', 'Sikh', 'Christian'] as const;

export function galleryBySlug(slug: string): GalleryTemplate | undefined {
  return GALLERY_TEMPLATES.find((t) => t.slug === slug);
}
`;

fs.writeFileSync(outPath, out);
console.log('wrote', all.length, 'templates to', outPath);
