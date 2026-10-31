import type { SpokePageConfig } from './types';

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
  primaryKeyword: 'hindu marriage biodata format',
  secondaryKeywords: [
    'hindu biodata for marriage',
    'marriage biodata with horoscope',
    'kundli details in biodata',
  ],
  title: 'Hindu Marriage Biodata Format with Horoscope Details',
  metaDescription:
    'Make a Hindu marriage biodata with rashi, nakshatra, gotra and manglik details built in. Pick a design and download a PDF.',
  h1: 'Hindu Marriage Biodata Format',
  breadcrumbName: 'Hindu',
  makerPosition: 'top',
  preset: {
    designSlug: 'zari-traditional',
    faith: 'Hindu',
    religion: 'Hindu',
    sectionOrder: ['personal', 'horoscope', 'education', 'family', 'contact'],
    openSectionId: 'horoscope',
  },
  intro:
    'A Hindu marriage biodata puts birth and horoscope details near the top, because many families check kundli compatibility before anything else. Every horoscope field below is optional; include what your family follows.',
  outlineH2s: [
    'Horoscope details, field by field',
    'Regional fields worth adding',
    'Sample Hindu marriage biodata',
    'When the horoscope isn’t relevant',
  ],
  steps: [],
  samples: {
    heading: '',
    qualifier: '',
    count: 0,
  },
  sampleDownloads: [],
  tips: [],
  sections: [
    {
      id: 'horoscope',
      h2: 'Horoscope details, field by field',
      table: {
        head: ['Field', 'What to write', 'Example'],
        rows: [
          [
            'Time of birth',
            'Exact time, AM or PM, from the birth record',
            '6:20 AM',
          ],
          ['Place of birth', 'City or town and state', 'Ranchi, Jharkhand'],
          ['Rashi', 'Moon sign, in Hindi or English or both', 'Simha (Leo)'],
          [
            'Nakshatra',
            'Birth star, with charan if known',
            'Magha, charan 2',
          ],
          ['Gotra', 'Family lineage on the father’s side', 'Kashyap'],
          [
            'Manglik',
            'Yes, No or Anshik (partial), as your pandit advises',
            'No',
          ],
        ],
      },
      after: [
        'Time and place of birth matter most: the pandit uses them to make the kundli. Even an hour’s error changes it, so copy the time from the birth certificate or family record.',
      ],
      image: {
        src: '/samples/hindu-marriage-biodata/horoscope-fields.webp',
        alt: 'Where rashi, nakshatra and gotra go in a Hindu marriage biodata',
      },
    },
    {
      id: 'regional',
      h2: 'Regional fields worth adding',
      list: [
        'Maharashtra: kul, kuldaivat and devak. See the [[P10|Marathi biodata]].',
        'South India: gothram, star (nakshatra) and rasi, often with lagnam.',
        'Gujarat and Rajasthan: gotra and native village, often with the mosal (mother’s family).',
        'North India: gotra of both father and mother, and whether you are manglik.',
      ],
    },
    {
      id: 'sample',
      h2: 'Sample Hindu marriage biodata',
      hideUnlinked: true,
      paras: [
        'See the filled examples for a [[P05|boy]] and a [[P06|girl]]. Both include the full horoscope block in this order.',
      ],
    },
    {
      id: 'no-horoscope',
      h2: 'When the horoscope isn’t relevant',
      paras: [
        'Plenty of Hindu families no longer match kundlis. Remove the horoscope fields and pick a modern design without a deity line. Nothing else on the biodata needs to change. [[P02|Browse modern templates]].',
      ],
    },
  ],
  faqs: [
    {
      q: 'What horoscope details go in a Hindu biodata?',
      a: 'Time and place of birth, rashi, nakshatra, gotra and manglik status. Include only what your family uses.',
    },
    {
      q: 'What if I don’t know my nakshatra?',
      a: 'Leave it blank, or ask your family pandit; it comes from your exact birth time and place.',
    },
    {
      q: 'Should I mention manglik status?',
      a: 'If the other families are likely to ask, yes. Write Yes, No or Anshik.',
    },
    {
      q: 'Can I attach my kundli to the biodata?',
      a: 'Send it as a separate file. Many families prefer to exchange the kundli after the biodata.',
    },
    {
      q: 'Can I make a Hindu biodata in Hindi?',
      a: 'Yes. [[P09|Make the biodata in Hindi]] with the same fields.',
      hideUnlinked: true,
    },
  ],
  relatedIds: ['P01', 'P05', 'P06', 'P10', 'P09', 'P02'],
};
