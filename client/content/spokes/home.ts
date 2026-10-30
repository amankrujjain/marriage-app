import type { SpokePageConfig } from './types';

/** Existing home route — copy stays as live site until item 9. */
export const home: SpokePageConfig = {
  id: 'P01',
  path: '/',
  segments: [],
  pageSlug: 'home',
  kind: 'existing',
  week: 1,
  plannedDate: '2026-11-02',
  published: true,
  hub: 'Home',
  intent: 'maker',
  language: 'en',
  primaryKeyword: 'biodata for marriage',
  secondaryKeywords: ['marriage biodata maker'],
  title: 'Free Marriage Biodata Maker | MarriageBio',
  metaDescription:
    'Create a print-ready Indian marriage biodata online. Free A4 designs, live preview, PDF and WhatsApp download.',
  h1: 'Free Marriage Biodata Maker',
  breadcrumbName: 'Home',
  makerPosition: 'top',
  preset: {},
  intro: 'Fill in your details, preview live on A4 designs, and download a print-ready PDF or WhatsApp image.',
  outlineH2s: [],
  steps: [],
  samples: {
    heading: 'Sample biodatas',
    qualifier: 'for marriage',
    count: 0,
  },
  sampleDownloads: [],
  tips: [],
  faqs: [],
  relatedIds: ['P02'],
};
