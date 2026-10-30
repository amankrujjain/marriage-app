import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'hindu marriage biodata format';

export const hindu: SpokePageConfig = {
  id: 'P07',
  path: '/hindu-marriage-biodata/',
  segments: ['hindu-marriage-biodata'],
  pageSlug: 'hindu-marriage-biodata',
  kind: 'spoke',
  week: 4,
  plannedDate: '2026-11-23',
  published: false,
  hub: 'Communities',
  intent: 'hindu',
  language: 'en',
  primaryKeyword: kw,
  secondaryKeywords: [],
  title: todoCopy(kw),
  metaDescription: todoCopy(kw),
  h1: todoCopy(kw),
  breadcrumbName: 'Hindu',
  makerPosition: 'top',
  preset: {
    designSlug: 'kalash-mangal',
    faith: 'Hindu',
    religion: 'Hindu',
  },
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
  relatedIds: ['P08', 'P01', 'P02', 'P03', 'P04'],
};
