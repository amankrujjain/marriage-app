import { LanguageCode } from '@marriage/shared';
import type { SpokePageConfig } from './types';

/** Existing home route — Phase 1 copy. */
export const home: SpokePageConfig = {
  id: 'P01',
  path: '/',
  segments: [],
  pageSlug: 'home',
  kind: 'existing',
  week: 1,
  plannedDate: '2026-11-02',
  published: true,
  hub: 'Home',
  intent: 'maker',
  language: 'en',
  primaryKeyword: 'biodata for marriage',
  secondaryKeywords: [
    'marriage biodata maker',
    'marriage biodata',
    'biodata maker',
  ],
  title: 'Biodata for Marriage: Free Maker, PDF in 2 Minutes',
  metaDescription:
    'Make your biodata for marriage in 2 minutes. Pick a design, fill in your details in English or Hindi, and download an A4 PDF and WhatsApp image.',
  h1: 'Make Your Biodata for Marriage in 2 Minutes',
  breadcrumbName: 'Home',
  makerPosition: 'top',
  preset: {
    designSlug: 'zari-traditional',
    exportLanguage: LanguageCode.EN,
    openSectionId: 'personal',
  },
  intro:
    'Fill in your details once, try them on every design, and download a print-ready A4 PDF and a WhatsApp-sized image. Your draft stays saved on your phone so you can come back and edit it.',
  outlineH2s: [],
  steps: [],
  samples: {
    heading: 'Sample biodatas',
    qualifier: 'for marriage',
    count: 0,
  },
  sampleDownloads: [],
  tips: [],
  faqs: [],
  sections: [
    {
      id: 'what-is',
      h2: 'What is a biodata for marriage?',
      paras: [
        'A biodata for marriage is a one-page introduction that families share when they look for a match. It covers who you are, your education and work, your family, and how to get in touch, usually with a photo. Most families read it on WhatsApp first, then print it for elders.',
        'People call it many things: marriage biodata, shaadi biodata, rishta biodata, vivah biodata or matrimonial biodata. It is the same page.',
      ],
    },
    {
      id: 'what-to-put',
      h2: 'What to put in your biodata',
      list: [
        'Personal details: full name, date of birth, height, religion, mother tongue.',
        'Horoscope details (if your family follows them): time and place of birth, rashi, nakshatra, gotra, manglik status.',
        'Education and work: highest degree, occupation, employer and city, income if you choose to share it.',
        'Family: parents’ names and occupations, brothers and sisters, native place.',
        'Contact: the person families should call, a mobile number, and your city.',
      ],
      after: [
        'Every field is optional. Leave a field blank and it stays off the page.',
      ],
    },
    {
      id: 'every-family',
      h2: 'A biodata for every family',
      hideUnlinked: true,
      list: [
        'Writing for a son? See the [[P05|marriage biodata format for boy]].',
        'Writing for a daughter? See the [[P06|marriage biodata format for girl]].',
        'Hindu families can start from the [[P07|Hindu marriage biodata format]], with horoscope details first.',
        'Muslim families can use the [[P08|Muslim marriage biodata format]], with no horoscope fields.',
        'Prefer your own language? Make a [[P09|biodata in Hindi]] or a [[P10|Marathi biodata]].',
        'Need a file to edit yourself? Download the [[P03|biodata format in Word]] or the [[P04|biodata format in PDF]].',
      ],
    },
    {
      id: 'why',
      h2: 'Why families use MarriageBio',
      hideUnlinked: true,
      list: [
        'Made for WhatsApp. Besides the PDF you get an image sized for a phone, so elders can read it without zooming.',
        'One page, every time. Text resizes to keep your biodata on one A4 page.',
        'Your family’s own fields. Add property, visa status or partner expectations. Complexion and caste are never required.',
        'Edit any time. Change your job or a phone number later and download again.',
      ],
      after: [
        'Not sure what to write? Read our guide on [[P11|how to make a marriage biodata]].',
      ],
    },
  ],
  relatedIds: ['P02'],
};
