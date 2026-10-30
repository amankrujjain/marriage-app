import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'biodata format in word';

export const formatWord: SpokePageConfig = {
  id: 'P03',
  path: '/marriage-biodata-format-word/',
  segments: ['marriage-biodata-format-word'],
  pageSlug: 'marriage-biodata-format-word',
  kind: 'spoke',
  week: 2,
  plannedDate: '2026-11-09',
  published: false,
  hub: 'Formats',
  intent: 'format-word',
  language: 'en',
  primaryKeyword: kw,
  secondaryKeywords: ['word file download'],
  title: todoCopy(kw),
  metaDescription: todoCopy(kw),
  h1: todoCopy(kw),
  breadcrumbName: 'Word format',
  makerPosition: 'top',
  preset: {
    designSlug: 'kagaz-modern',
    format: 'docx',
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
  relatedIds: ['P04', 'P01', 'P02'],
};
