import type { SpokePageConfig } from './types';
import { LanguageCode } from '@marriage/shared';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'शादी के लिए बायोडाटा';

export const hi: SpokePageConfig = {
  id: 'P09',
  path: '/hi/',
  segments: ['hi'],
  pageSlug: 'hi',
  kind: 'spoke',
  week: 6,
  plannedDate: '2026-12-07',
  published: false,
  hub: 'Languages',
  intent: 'hindi',
  language: 'hi',
  primaryKeyword: kw,
  secondaryKeywords: ['biodata in hindi'],
  title: todoCopy(kw),
  metaDescription: todoCopy(kw),
  h1: todoCopy(kw),
  breadcrumbName: 'हिंदी',
  makerPosition: 'top',
  preset: {
    designSlug: 'zari-traditional',
    exportLanguage: LanguageCode.HI,
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
  relatedIds: ['P10', 'P01', 'P02', 'P03', 'P04'],
};
