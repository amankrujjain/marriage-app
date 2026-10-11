import { TemplateId } from '@marriage/shared';

export type GalleryStyle = 'Traditional' | 'Royal' | 'Floral' | 'Modern';
export type GalleryFaith = 'Hindu' | 'Muslim' | 'Sikh';
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
  {
    slug: 'zari-traditional',
    name: 'Zari Traditional',
    tier: 'Free',
    cat: 'Traditional',
    faith: ['Hindu', 'Sikh'],
    blurb: 'Maroon and gold zari border with rosette corners. The classic family biodata.',
    templateId: TemplateId.TRADITIONAL_MAROON,
  },
  {
    slug: 'panna-royal',
    name: 'Panna Royal',
    tier: 'Premium',
    cat: 'Royal',
    faith: ['Hindu', 'Muslim', 'Sikh'],
    blurb: 'Deep emerald green with a gold arch frame and lattice. Rich and formal.',
    templateId: TemplateId.ROYAL_GOLD,
  },
  {
    slug: 'gulab-floral',
    name: 'Gulab Floral',
    tier: 'Free',
    cat: 'Floral',
    faith: ['Hindu'],
    blurb: 'Cream page with soft rose clusters in two corners and a round photo.',
    templateId: TemplateId.FLORAL_SOFT,
  },
  {
    slug: 'kagaz-modern',
    name: 'Kagaz Modern',
    tier: 'Free',
    cat: 'Modern',
    faith: ['Hindu', 'Muslim', 'Sikh'],
    blurb: 'Clean white page with a side rail. Easy to read, easy on the printer.',
    templateId: TemplateId.MODERN_CLEAN,
  },
  {
    slug: 'suryavanshi-royal',
    name: 'Suryavanshi Royal',
    tier: 'Premium',
    cat: 'Royal',
    faith: ['Hindu'],
    blurb: 'Maroon header with a gold temple skyline and a round photo.',
    templateId: TemplateId.ELEGANT_SERIF,
  },
  {
    slug: 'rangoli-floral',
    name: 'Rangoli Floral',
    tier: 'Free',
    cat: 'Floral',
    faith: ['Hindu'],
    blurb: 'Warm cream with pink blossoms, a rangoli ring and an arched photo.',
    templateId: TemplateId.FLORAL_SOFT,
  },
  {
    slug: 'varma-traditional',
    name: 'Varma Traditional',
    tier: 'Premium',
    cat: 'Traditional',
    faith: ['Hindu', 'Sikh'],
    blurb: 'Full maroon panel inside an ornate triple gold frame.',
    templateId: TemplateId.TRADITIONAL_MAROON,
  },
  {
    slug: 'aarohi-modern',
    name: 'Aarohi Modern',
    tier: 'Free',
    cat: 'Modern',
    faith: ['Hindu', 'Muslim', 'Sikh'],
    blurb: 'Soft beige, a left-aligned name and tidy cards. Calm and contemporary.',
    templateId: TemplateId.MINIMAL_LINE,
  },
];

export const STYLE_FILTERS = ['All', 'Traditional', 'Royal', 'Floral', 'Modern'] as const;
export const FAITH_FILTERS = ['Hindu', 'Muslim', 'Sikh'] as const;

export function galleryBySlug(slug: string): GalleryTemplate | undefined {
  return GALLERY_TEMPLATES.find((t) => t.slug === slug);
}
