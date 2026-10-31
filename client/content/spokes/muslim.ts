import type { SpokePageConfig } from './types';

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
  primaryKeyword: 'muslim biodata for marriage',
  secondaryKeywords: [
    'rishta biodata',
    'muslim marriage biodata format',
    'nikah biodata',
  ],
  title: 'Muslim Marriage Biodata Format: Rishta Biodata Maker',
  metaDescription:
    'Make a Muslim marriage biodata for rishta in 2 minutes. Add sect, education and family details, start with Bismillah, and download a PDF.',
  h1: 'Muslim Marriage Biodata Format',
  breadcrumbName: 'Muslim',
  makerPosition: 'top',
  preset: {
    designSlug: 'khatam-emerald',
    faith: 'Muslim',
    religion: 'Muslim',
    sectionOrder: ['personal', 'education', 'family', 'contact', 'horoscope'],
    openSectionId: 'personal',
  },
  intro:
    'A rishta biodata introduces the person and the family: education, work, family background and the faith details that matter to you. There are no horoscope fields; add only what you want the other family to know.',
  outlineH2s: [
    'What to include in a Muslim marriage biodata',
    'Sample Muslim marriage biodata',
    'The opening line',
    'Respectful wording for elders',
  ],
  steps: [],
  samples: {
    heading: '',
    qualifier: '',
    designSlugs: ['khatam-emerald', 'sabz-minimal'],
    count: 2,
    alts: {
      'khatam-emerald':
        'Muslim marriage biodata format in green and gold with Bismillah',
      'sabz-minimal': 'Simple Muslim marriage biodata format in white',
    },
  },
  sampleDownloads: [],
  tips: [],
  sections: [
    {
      id: 'include',
      h2: 'What to include in a Muslim marriage biodata',
      list: [
        'Personal: full name, date of birth, height, mother tongue, city.',
        'Faith, if you want to share it: sect (Sunni, Shia), maslak or school of thought, and a line on religious practice in your own words.',
        'Education and work: degree, institution, occupation, employer and city.',
        'Family: father’s and mother’s names and occupations, brothers and sisters with their marital status, native place.',
        'Looking for: a short line on the partner and family you hope to find.',
        'Contact: usually a parent or elder of the family.',
      ],
    },
    {
      id: 'sample',
      h2: 'Sample Muslim marriage biodata',
      table: {
        head: ['Field', 'Sample'],
        rows: [
          ['Name', 'Zoya Imran Siddiqui'],
          ['Date of birth', '22 January 1998'],
          ['Height', '5 ft 3 in (160 cm)'],
          ['Sect', 'Sunni'],
          ['Mother tongue', 'Urdu'],
          ['Education', 'B.Pharm, Jamia Hamdard, New Delhi'],
          ['Occupation', 'Pharmacist, Apollo Pharmacy, Lucknow'],
          [
            'Father',
            'Janab Imran Siddiqui, businessman (textiles), Lucknow',
          ],
          ['Mother', 'Mohtarma Nazia Siddiqui, homemaker'],
          [
            'Siblings',
            '1 elder brother (married), 1 younger sister (studying)',
          ],
          [
            'Looking for',
            'An educated, practising family; open to living in Lucknow or Delhi',
          ],
          ['Contact', 'Imran Siddiqui (father), +91 9XXXX XXXXX'],
        ],
      },
      after: [
        'This is an invented example. Make your own with this layout in the maker above.',
      ],
    },
    {
      id: 'opening',
      h2: 'The opening line',
      paras: [
        'Most families open with “بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ” or a shorter “بِسْمِ ٱللَّٰهِ”.',
      ],
    },
    {
      id: 'elders',
      h2: 'Respectful wording for elders',
      paras: [
        'Use Janab or Mohtarma before parents’ names if your family does. Keep the faith line factual, such as “Offers regular namaz” or “Practising family”, and let the conversation carry the rest.',
      ],
    },
  ],
  faqs: [
    {
      q: 'What is a rishta biodata?',
      a: 'The biodata families share when a rishta is being considered. It is the same as a marriage biodata.',
    },
    {
      q: 'Does a Muslim biodata need horoscope details?',
      a: 'No. This format has no horoscope fields.',
    },
    {
      q: 'Should I mention my sect?',
      a: 'Many families do, as it helps both sides. It’s optional; leave it blank if you prefer.',
    },
    {
      q: 'Can I make the biodata in Urdu?',
      a: 'An Urdu version of the maker is planned. For now, make it in English or [[P09|in Hindi]].',
    },
  ],
  relatedIds: ['P01', 'P06', 'P05', 'P02', 'P09'],
};
