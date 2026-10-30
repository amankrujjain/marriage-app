import type { SpokePageConfig } from './types';
import { Gender } from '@marriage/shared';
import { todoCopy, todoSteps, todoTips } from './todoCopy';

const kw = 'biodata for marriage boy';

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
  title: 'Marriage Biodata for Boy: Free Maker + Word & PDF',
  metaDescription:
    'Make a marriage biodata for a boy in 2 minutes. Pick a design, add job, family and horoscope details, and download a print-ready PDF.',
  h1: 'Marriage Biodata Format for Boy',
  breadcrumbName: 'For boy',
  makerPosition: 'top',
  preset: {
    designSlug: 'zari-traditional',
    gender: Gender.MALE,
    sectionOrder: ['personal', 'education', 'family', 'horoscope', 'contact'],
    openSectionId: 'education',
  },
  intro: todoCopy(kw),
  outlineH2s: [
    "What to include in a boy's biodata",
    'Order families read it in',
    'Job and income: how to write them',
    'Sample biodatas for boys',
    'FAQs',
  ],
  steps: todoSteps(kw),
  samples: {
    heading: 'Sample biodatas for boys',
    qualifier: 'for boy',
    count: 6,
    includeNoPhoto: true,
  },
  // TODO_ASSET: add when client/public/samples/Biodata-for-boy-sample.docx/.pdf exist
  sampleDownloads: [],
  tips: todoTips(kw),
  faqs: [
    { q: "Should a boy's biodata mention salary?", a: todoCopy(kw) },
    { q: 'Monthly or yearly income?', a: todoCopy(kw) },
    { q: 'Photo: formal or casual?', a: todoCopy(kw) },
    { q: 'One page or two?', a: todoCopy(kw) },
  ],
  relatedIds: ['P06', 'P07', 'P23', 'P03'],
  wordsTarget: 500,
};
