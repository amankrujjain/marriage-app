import type { Gender, LanguageCode } from '@marriage/shared';

export type SpokeHub =
  | 'Home'
  | 'Templates'
  | 'Formats'
  | 'Boy and girl'
  | 'Communities'
  | 'Languages'
  | 'Guides';

export type SpokeFaith = 'Hindu' | 'Muslim' | 'Sikh' | 'Christian';

export type SpokePreset = {
  designSlug?: string;
  faith?: SpokeFaith;
  gender?: Gender;
  exportLanguage?: LanguageCode;
  format?: 'pdf' | 'docx';
  /** Section ids: personal, horoscope, education, family, contact */
  sectionOrder?: string[];
  openSectionId?: string;
  religion?: string;
};

export type SpokeStep = {
  title: string;
  body: string;
};

export type SpokeSamples = {
  heading: string;
  qualifier: string;
  designSlugs?: string[];
  count: number;
  includeNoPhoto?: boolean;
};

export type SpokeSampleDownload = {
  label: string;
  href: string;
};

export type SpokeTip = {
  title: string;
  body: string;
};

export type SpokeFaq = {
  q: string;
  a: string;
};

export type SpokePageConfig = {
  id: string;
  /** Exact public URL, always ends with `/`. */
  path: string;
  /** App-router catch-all segments; empty for `/`. */
  segments: string[];
  /** GA4 page_slug; `'home'` for `/`, `'templates'` for `/templates/`. */
  pageSlug: string;
  kind: 'existing' | 'spoke';
  week: number;
  plannedDate: string;
  published: boolean;
  hub: SpokeHub;
  intent: string;
  language: 'en' | 'hi' | 'mr';
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  metaDescription: string;
  h1: string;
  breadcrumbName: string;
  makerPosition: 'top' | 'afterIntro';
  preset: SpokePreset;
  intro: string;
  outlineH2s: string[];
  steps: SpokeStep[];
  samples: SpokeSamples;
  sampleDownloads: SpokeSampleDownload[];
  tips: SpokeTip[];
  faqs: SpokeFaq[];
  relatedIds: string[];
  wordsTarget?: number;
};
