import type { SpokePageConfig } from './types';
import { todoCopy, todoFaqs, todoSteps, todoTips } from './todoCopy';

const kw = 'how to make biodata for marriage';

export const howToMake: SpokePageConfig = {
  id: 'P11',
  path: '/guide/how-to-make-marriage-biodata/',
  segments: ['guide', 'how-to-make-marriage-biodata'],
  pageSlug: 'how-to-make-marriage-biodata',
  kind: 'spoke',
  week: 8,
  plannedDate: '2026-12-21',
  published: false,
  hub: 'Guides',
  intent: 'guide',
  language: 'en',
  primaryKeyword: kw,
  secondaryKeywords: ['what to write in marriage biodata'],
  title: todoCopy(kw),
  metaDescription: todoCopy(kw),
  h1: todoCopy(kw),
  breadcrumbName: 'How to make',
  makerPosition: 'afterIntro',
  preset: {
    designSlug: 'kagaz-modern',
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
  relatedIds: ['P01', 'P02', 'P03', 'P04'],
};
