import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'biodata for marriage girl';

/** Stub config — keywords, preset, and copy filled in item 2. */
export const formatGirl: SpokePageConfig = {
  id: 'P06',
  path: '/marriage-biodata-format-for-girl/',
  segments: ['marriage-biodata-format-for-girl'],
  pageSlug: 'marriage-biodata-format-for-girl',
  kind: 'spoke',
  week: 3,
  plannedDate: '2026-11-16',
  published: false,
  hub: 'Boy and girl',
  intent: 'girl',
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
  relatedIds: ['P05', 'P01', 'P02', 'P03'],
};
