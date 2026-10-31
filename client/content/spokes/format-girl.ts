import { Gender } from '@marriage/shared';
import type { SpokePageConfig } from './types';

export const formatGirl: SpokePageConfig = {
  id: 'P06',
  path: '/marriage-biodata-format-for-girl/',
  segments: ['marriage-biodata-format-for-girl'],
  pageSlug: 'marriage-biodata-format-for-girl',
  kind: 'spoke',
  week: 3,
  plannedDate: '2026-11-16',
  published: false,
  hub: 'Boy and girl',
  intent: 'girl',
  language: 'en',
  primaryKeyword: 'biodata for marriage girl',
  secondaryKeywords: [
    'marriage biodata format for girl',
    'girl biodata for marriage',
    'bride biodata',
  ],
  title: 'Marriage Biodata for Girl: Free Format, Word & PDF',
  metaDescription:
    'Make a marriage biodata for a girl in 2 minutes. Lead with education and career, add family and horoscope details, and download a PDF.',
  h1: 'Marriage Biodata Format for Girl',
  breadcrumbName: 'For girl',
  makerPosition: 'top',
  preset: {
    designSlug: 'panna-royal',
    gender: Gender.FEMALE,
    sectionOrder: ['personal', 'education', 'family', 'horoscope', 'contact'],
    openSectionId: 'education',
  },
  intro:
    'Most families now read a girl’s biodata for her education and career first, then her family. Lead with what she has studied and does, say plainly what she is looking for, and choose whether to include a photo.',
  outlineH2s: [
    'What to include in a girl’s biodata',
    'Sample marriage biodata for girl',
    'Stating her preferences',
    'With a photo or without?',
    'Writing for a son instead?',
  ],
  steps: [],
  samples: {
    heading: '',
    qualifier: 'for girl',
    designSlugs: ['panna-royal'],
    count: 1,
    alts: {
      'panna-royal':
        'Marriage biodata format for girl with photo, green and gold design',
    },
  },
  sampleDownloads: [],
  tips: [],
  sections: [
    {
      id: 'include',
      h2: 'What to include in a girl’s biodata',
      list: [
        'Education: degree, subject, institution, and any professional qualification such as CA, MBBS or B.Ed.',
        'Occupation: role, organisation and city, or what she is preparing for.',
        'Family background: parents’ occupations, siblings, native place.',
        'Horoscope details: if the families match kundlis.',
        'Her preferences: whether she plans to keep working, and whether she is open to relocating.',
      ],
    },
    {
      id: 'sample',
      h2: 'Sample marriage biodata for girl',
      table: {
        head: ['Field', 'Sample'],
        rows: [
          ['Name', 'Ananya Ramesh Sharma'],
          ['Date of birth', '14 August 1997'],
          ['Time and place of birth', '6:20 AM, Ranchi'],
          ['Height', '5 ft 4 in (163 cm)'],
          ['Religion', 'Hindu'],
          ['Gotra and rashi', 'Kashyap, Simha'],
          ['Education', 'M.Sc. Chemistry, BHU Varanasi'],
          ['Occupation', 'Assistant Professor, Ranchi University'],
          ['Hobbies', 'Kathak, reading, cooking'],
          [
            'Father',
            'Shri Ramesh Kumar Sharma, retired Branch Manager, SBI',
          ],
          ['Mother', 'Smt. Sunita Sharma, homemaker'],
          [
            'Siblings',
            '1 elder brother (married), Software Engineer, Pune',
          ],
          [
            'Looking for',
            'An educated, family-minded partner; she plans to keep working',
          ],
          ['Contact', 'Ramesh Kumar Sharma (father), +91 9XXXX XXXXX'],
        ],
      },
      after: [
        'This is an invented example. Make your own with this layout in the maker above.',
      ],
    },
    {
      id: 'preferences',
      h2: 'Stating her preferences',
      paras: [
        'A short line saves weeks of back-and-forth. Write it in her words, for example: “Plans to continue teaching after marriage; open to moving within India.” If she has a view on joint or nuclear family, add it here too.',
      ],
    },
    {
      id: 'photo',
      h2: 'With a photo or without?',
      paras: [
        'A clear photo gets faster replies. Many families still prefer to share the photo only once a match looks serious, especially when the biodata is forwarded beyond people they know.',
        'If you do add one: a recent, well-lit photo from the chest up, against a plain background. A saree, suit or kurti all work; skip heavy filters.',
      ],
    },
    {
      id: 'son',
      h2: 'Writing for a son instead?',
      hideUnlinked: true,
      paras: [
        'See the [[P05|marriage biodata format for boy]].',
        'Muslim families can start from the [[P08|Muslim marriage biodata format]].',
      ],
    },
  ],
  faqs: [
    {
      q: 'What should a girl write in her biodata?',
      a: 'Education, occupation, family details, horoscope details if relevant, and a line on what she is looking for.',
    },
    {
      q: 'Should a girl’s biodata have a photo?',
      a: 'It helps, but it’s optional.',
    },
    {
      q: 'Should a girl mention her income?',
      a: 'If she wants to. Many working women now include it; it’s never required.',
    },
    {
      q: 'Can I make the biodata in Hindi?',
      a: 'Yes. [[P09|Make the biodata in Hindi]] with the same layout.',
      hideUnlinked: true,
    },
  ],
  relatedIds: ['P01', 'P05', 'P08', 'P09', 'P02', 'P04'],
};
