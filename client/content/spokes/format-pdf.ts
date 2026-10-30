import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'biodata format pdf';

/** Stub config — keywords, preset, and copy filled in item 2. */
export const formatPdf: SpokePageConfig = {
  id: 'P04',
  path: '/marriage-biodata-format-pdf/',
  segments: ['marriage-biodata-format-pdf'],
  pageSlug: 'marriage-biodata-format-pdf',
  kind: 'spoke',
  week: 2,
  plannedDate: '2026-11-09',
  published: false,
  hub: 'Formats',
  intent: 'format-pdf',
  language: 'en',
  primaryKeyword: kw,
  secondaryKeywords: [],
  title: todoCopy(kw),
  metaDescription: todoCopy(kw),
  h1: todoCopy(kw),
  breadcrumbName: todoCopy(kw),
  makerPosition: 'top',
  preset: {},
  intro: todoCopy(kw),
  outlineH2s: [todoCopy(kw), todoCopy(kw), todoCopy(kw), todoCopy(kw)],
  steps: todoSteps(kw),
  samples: {
    heading: todoCopy(kw),
    qualifier: todoCopy(kw),
    count: 6,
  },
  sampleDownloads: [],
  tips: todoTips(kw),
  faqs: todoFaqs(kw),
  relatedIds: ['P03', 'P01', 'P02'],
};
