import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'muslim biodata for marriage';

/** Stub config — keywords, preset, and copy filled in item 2. */
export const muslim: SpokePageConfig = {
  id: 'P08',
  path: '/muslim-marriage-biodata/',
  segments: ['muslim-marriage-biodata'],
  pageSlug: 'muslim-marriage-biodata',
  kind: 'spoke',
  week: 5,
  plannedDate: '2026-11-30',
  published: false,
  hub: 'Communities',
  intent: 'muslim',
  language: 'en',
  primaryKeyword: kw,
  secondaryKeywords: ['rishta biodata'],
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
  relatedIds: ['P07', 'P01', 'P02', 'P03'],
};
