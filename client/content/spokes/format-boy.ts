import { Gender } from '@marriage/shared';
import type { SpokePageConfig } from './types';

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
  primaryKeyword: 'biodata for marriage boy',
  secondaryKeywords: [
    'marriage biodata format for boy',
    'boy biodata for marriage',
    'groom biodata',
  ],
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
  intro:
    'A boy’s biodata is read for three things first: what he does, where he works and how settled he is. Put those near the top, keep the rest short, and add a clear photo.',
  outlineH2s: [
    'What the girl’s family looks for first',
    'Sample marriage biodata for boy',
    'How to write job and income',
    'If you live or work abroad',
    'Photo tips for boys',
    'Writing for a daughter instead?',
  ],
  steps: [],
  samples: {
    heading: '',
    qualifier: 'for boy',
    designSlugs: ['zari-traditional', 'kagaz-modern'],
    count: 2,
    alts: {
      'zari-traditional':
        'Marriage biodata format for boy with photo, traditional maroon design',
      'kagaz-modern': 'Modern marriage biodata format for boy',
    },
  },
  sampleDownloads: [],
  tips: [],
  sections: [
    {
      id: 'reads-first',
      h2: 'What the girl’s family looks for first',
      list: [
        'Education and occupation: the degree, job title, employer and city.',
        'Income: a monthly or yearly figure, if your family is comfortable sharing it.',
        'Family background: parents’ occupations, siblings, native place.',
        'Horoscope details: time and place of birth, rashi, gotra, if the families match kundlis.',
        'Photo: recent and clear.',
      ],
    },
    {
      id: 'sample',
      h2: 'Sample marriage biodata for boy',
      table: {
        head: ['Field', 'Sample'],
        rows: [
          ['Name', 'Rohan Suresh Verma'],
          ['Date of birth', '3 March 1995'],
          ['Time and place of birth', '7:45 AM, Lucknow'],
          ['Height', '5 ft 10 in (178 cm)'],
          ['Religion and caste', 'Hindu, Kayastha'],
          ['Rashi and nakshatra', 'Kumbh, Shatabhisha'],
          ['Education', 'B.Tech (Computer Science), IIIT Allahabad'],
          ['Occupation', 'Senior Software Engineer, Bengaluru'],
          ['Annual income', '₹18 LPA'],
          [
            'Father',
            'Shri Suresh Verma, retired Section Officer, UP Secretariat',
          ],
          ['Mother', 'Smt. Meena Verma, homemaker'],
          ['Siblings', '1 younger sister, studying MBA'],
          ['Native place', 'Lucknow, Uttar Pradesh'],
          ['Contact', 'Suresh Verma (father), +91 9XXXX XXXXX'],
        ],
      },
      after: [
        'This is an invented example. Make your own with this layout in the maker above.',
      ],
    },
    {
      id: 'job-income',
      h2: 'How to write job and income',
      list: [
        'Name the role, the company or business, and the city: “Senior Software Engineer, Infosys, Bengaluru”.',
        'For a family business, describe it plainly: “Runs family hardware business, Deoghar, 12 years”.',
        'Write income one way and stick to it: “₹18 LPA” or “₹1.5 lakh per month”. Round figures are fine; inflated ones come out in the first conversation.',
        'Government job? Give the post and department: “Assistant Section Officer, CSS, New Delhi”.',
      ],
    },
    {
      id: 'abroad',
      h2: 'If you live or work abroad',
      paras: [
        'Add the country and city, your visa status (work visa, permanent resident or citizen), and how often you visit India. Families plan around these, so stating them up front saves time.',
      ],
    },
    {
      id: 'photo',
      h2: 'Photo tips for boys',
      paras: [
        'Use a recent, well-lit photo from the chest up. A collared shirt or kurta against a plain wall works best. Skip sunglasses, group photos and heavy filters.',
      ],
      image: {
        src: '/samples/marriage-biodata-format-for-boy/photo-guide.webp',
        alt: 'Good photo for boy’s marriage biodata, plain background and collared shirt',
      },
    },
    {
      id: 'daughter',
      h2: 'Writing for a daughter instead?',
      hideUnlinked: true,
      paras: [
        'See the [[P06|marriage biodata format for girl]].',
        'Hindu families can also start from the [[P07|Hindu marriage biodata format]], which puts horoscope details first.',
      ],
    },
  ],
  faqs: [
    {
      q: 'Should a boy’s biodata mention salary?',
      a: 'Most families expect it, but it’s your choice. If you include it, write a round, accurate figure.',
    },
    {
      q: 'Monthly or yearly income?',
      a: 'Either works. Yearly (LPA) is common for private jobs; monthly is common for government jobs and business.',
    },
    {
      q: 'What photo should a boy use?',
      a: 'A recent, clear chest-up photo in a shirt or kurta against a plain background.',
    },
    {
      q: 'Should the biodata be one page or two?',
      a: 'One page is enough for most.',
    },
    {
      q: 'Can I download the boy’s format in Word?',
      a: 'Yes. Get the [[P03|biodata format in Word]] and fill it yourself.',
      hideUnlinked: true,
    },
  ],
  relatedIds: ['P01', 'P06', 'P07', 'P03', 'P04', 'P02'],
  wordsTarget: 500,
};
