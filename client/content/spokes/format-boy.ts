import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'biodata for marriage boy';

/** Stub config — exact P05 copy and preset filled in item 2. */
export const formatBoy: SpokePageConfig = {
  id: 'P05',
  path: '/marriage-biodata-format-for-boy/',
  segments: ['marriage-biodata-format-for-boy'],
  pageSlug: 'marriage-biodata-format-for-boy',
  kind: 'spoke',
  week: 3,
  plannedDate: '2026-11-16',
  published: false,
  hub: 'Boy and girl',
  intent: 'boy',
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
  outlineH2s: [todoCopy(kw), todoCopy(kw), todoCopy(kw), todoCopy(kw), todoCopy(kw)],
  steps: todoSteps(kw),
  samples: {
    heading: todoCopy(kw),
    qualifier: todoCopy(kw),
    count: 6,
    includeNoPhoto: true,
  },
  sampleDownloads: [],
  tips: todoTips(kw),
  faqs: todoFaqs(kw),
  relatedIds: ['P06', 'P01', 'P02', 'P03'],
  wordsTarget: 500,
};
