import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'लग्नाचा बायोडाटा';

/** Stub config — Marathi copy and language preset filled in item 2. */
export const marathi: SpokePageConfig = {
  id: 'P10',
  path: '/marathi-biodata/',
  segments: ['marathi-biodata'],
  pageSlug: 'marathi-biodata',
  kind: 'spoke',
  week: 7,
  plannedDate: '2026-12-14',
  published: false,
  hub: 'Languages',
  intent: 'marathi',
  language: 'mr',
  primaryKeyword: kw,
  secondaryKeywords: ['marathi biodata format'],
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
  relatedIds: ['P09', 'P01', 'P02', 'P03'],
};
