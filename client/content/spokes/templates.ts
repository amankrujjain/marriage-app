import type { SpokePageConfig } from './types';

/** Existing templates gallery — Phase 1 copy. */
export const templates: SpokePageConfig = {
  id: 'P02',
  path: '/templates/',
  segments: ['templates'],
  pageSlug: 'templates',
  kind: 'existing',
  week: 1,
  plannedDate: '2026-11-02',
  published: true,
  hub: 'Templates',
  intent: 'templates',
  language: 'en',
  primaryKeyword: 'marriage biodata templates',
  secondaryKeywords: [
    'biodata format',
    'marriage biodata format',
    'biodata design',
  ],
  title: 'Marriage Biodata Templates for Every Family',
  metaDescription:
    'Browse marriage biodata templates: traditional, royal, floral and modern. Try your own details on any design before you download.',
  h1: 'Marriage Biodata Templates',
  breadcrumbName: 'Designs',
  makerPosition: 'top',
  preset: {},
  intro:
    'Pick a design that suits your family, then see your own details on it before you download. Every template is A4 and prints cleanly in colour or black and white.',
  outlineH2s: [],
  steps: [],
  samples: {
    heading: 'Designs',
    qualifier: 'template',
    count: 0,
  },
  sampleDownloads: [],
  tips: [],
  sections: [
    {
      id: 'choose',
      h2: 'How to choose a template',
      paras: [
        'Match your family’s taste. Elders in traditional families usually expect a deity line and a decorative border. Families looking for an urban match often prefer a clean, modern page.',
      ],
    },
    {
      id: 'community',
      h2: 'Templates by community',
      hideUnlinked: true,
      paras: [
        'See the [[P07|Hindu marriage biodata format]] for horoscope-first layouts, or the [[P08|Muslim marriage biodata format]] for layouts without horoscope fields. For a son or daughter, start from the [[P05|biodata format for boy]] or the [[P06|biodata format for girl]].',
        'Want a blank file to type into yourself? Get the [[P03|biodata format in Word]].',
      ],
    },
  ],
  faqs: [
    {
      q: 'Which biodata template is best?',
      a: 'The one your family will be comfortable sending. Traditional designs suit most Hindu families; modern designs suit professionals and inter-community matches.',
    },
    {
      q: 'Can I change the template after filling in my details?',
      a: 'Yes. Your details stay the same while you switch designs, as many times as you like.',
    },
  ],
  relatedIds: ['P01', 'P07', 'P08', 'P05', 'P06', 'P03'],
};
