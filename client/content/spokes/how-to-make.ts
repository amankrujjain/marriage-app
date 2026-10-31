import type { SpokePageConfig } from './types';

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
  primaryKeyword: 'how to make biodata for marriage',
  secondaryKeywords: [
    'what to write in marriage biodata',
    'marriage biodata tips',
    'how to write biodata for marriage',
  ],
  title: 'How to Make a Marriage Biodata: Step-by-Step Guide',
  metaDescription:
    'What to write in a marriage biodata, in what order, and what to leave out. A step-by-step guide with a checklist, samples and a free maker.',
  h1: 'How to Make a Marriage Biodata, Step by Step',
  breadcrumbName: 'How to make',
  makerPosition: 'none',
  articleSchema: true,
  preset: {
    designSlug: 'zari-traditional',
  },
  introCta: {
    label: 'Start your biodata',
    href: '/?design=zari-traditional#form',
  },
  intro:
    'A good marriage biodata answers the questions the other family would ask anyway, in the order they would ask them, on one page. This guide takes you through it in seven steps; most people finish in under 30 minutes, including collecting the details.',
  outlineH2s: [
    'Step 1: Collect the details first',
    'Step 2: Decide what to include',
    'Step 3: Write each section plainly',
    'Step 4: Choose a design',
    'Step 5: Add the right photo',
    'Step 6: Proofread before you send',
    'Step 7: Share it the right way',
    'Make it in your language',
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
      id: 'step-1',
      h2: 'Step 1: Collect the details first',
      paras: [
        'Get these together before you start typing; hunting for them mid-way is what makes a biodata take an evening.',
      ],
      checklist: true,
      list: [
        '☐ Exact date, time and place of birth (from the birth certificate or family record)',
        '☐ Height in feet and inches',
        '☐ Highest degree, college and year',
        '☐ Current job title, employer and city, and income if you will share it',
        '☐ Parents’ full names and occupations',
        '☐ Brothers and sisters, with whether they are married',
        '☐ Native place, and for some families the mama’s name',
        '☐ Rashi, nakshatra, gotra and manglik status, if your family uses them',
        '☐ One recent, clear photo',
        '☐ The name and mobile number of the person families should call',
      ],
    },
    {
      id: 'step-2',
      h2: 'Step 2: Decide what to include',
      paras: [
        'Start with the five standard sections: personal, horoscope, education and work, family, contact. Then remove what doesn’t apply. A family that doesn’t match kundlis can drop the horoscope section entirely. Complexion, caste and blood group are optional; include them only if your community expects them.',
      ],
      image: {
        src: '/samples/how-to-make-marriage-biodata/biodata-sections.webp',
        alt: 'Parts of a marriage biodata: personal, horoscope, education, family and contact',
      },
    },
    {
      id: 'step-3',
      h2: 'Step 3: Write each section plainly',
      hideUnlinked: true,
      list: [
        'Name: full name as the family uses it, such as “Ananya Ramesh Sharma”.',
        'Dates: one format throughout, such as “14 August 1997”.',
        'Education: degree and institution, not every school you attended.',
        'Work: role, employer and city in one line.',
        'Family: parent, occupation, one line each. Add “retired” where it applies.',
        'Expectations: one or two sentences about the partner you hope for. Specific beats generic.',
      ],
      after: [
        'For what to emphasise, see the [[P05|biodata format for boy]] and the [[P06|biodata format for girl]].',
      ],
      image: {
        src: '/samples/how-to-make-marriage-biodata/before-after.webp',
        alt: 'Marriage biodata before and after formatting',
      },
      cta: {
        label: 'Start your biodata',
        href: '/?design=zari-traditional#form',
      },
    },
    {
      id: 'step-4',
      h2: 'Step 4: Choose a design',
      paras: [
        'Pick a design the people receiving it will be comfortable with. Traditional borders and a blessing line suit most Hindu families; Muslim families often prefer green and gold; professionals and inter-community matches often choose a clean modern page. [[P02|Compare all templates]].',
      ],
    },
    {
      id: 'step-5',
      h2: 'Step 5: Add the right photo',
      paras: [
        'Recent, well-lit, face clearly visible, plain background, from the chest up. Avoid group photos, sunglasses and heavy filters.',
      ],
      image: {
        src: '/samples/how-to-make-marriage-biodata/photo-do-dont.webp',
        alt: 'Good and bad photos for a marriage biodata',
      },
    },
    {
      id: 'step-6',
      h2: 'Step 6: Proofread before you send',
      checklist: true,
      list: [
        '☐ Name spelled as it appears on documents',
        '☐ Date and time of birth match the birth record',
        '☐ Mobile number works and someone will answer it',
        '☐ Income and job title are current',
        '☐ The whole biodata fits on one page',
      ],
      after: [
        'A wrong birth time can lead to a wrong kundli match, so check that line twice.',
      ],
    },
    {
      id: 'step-7',
      h2: 'Step 7: Share it the right way',
      hideUnlinked: true,
      paras: [
        'Send the PDF on WhatsApp as a Document, not as a photo, so it stays sharp. Keep a few printed copies for relatives who prefer paper. When your job or details change, update the biodata before you send it again.',
      ],
      after: [
        'More on this in the [[P04|biodata format in PDF]] guide.',
      ],
    },
    {
      id: 'language',
      h2: 'Make it in your language',
      hideUnlinked: true,
      paras: [
        'The same steps work in [[P09|Hindi]] and [[P10|Marathi]]. Hindu families can see each horoscope field explained in the [[P07|Hindu marriage biodata format]]; Muslim families can start from the [[P08|Muslim marriage biodata format]].',
      ],
    },
  ],
  faqs: [
    {
      q: 'How long should a marriage biodata be?',
      a: 'One page for most people.',
    },
    {
      q: 'What should not be written in a biodata?',
      a: 'Anything you can’t stand behind in a conversation: inflated income, outdated jobs, or private details you wouldn’t want forwarded.',
    },
    {
      q: 'Should a biodata include a phone number?',
      a: 'Yes, usually a parent’s or elder’s number. Families expect to call before they meet.',
    },
    {
      q: 'How do I make a biodata on my phone?',
      a: 'Use the [[P01|online biodata maker]] in your phone’s browser; the PDF saves straight to the phone.',
    },
  ],
  relatedIds: [
    'P01',
    'P02',
    'P03',
    'P04',
    'P05',
    'P06',
    'P07',
    'P08',
    'P09',
    'P10',
  ],
};
