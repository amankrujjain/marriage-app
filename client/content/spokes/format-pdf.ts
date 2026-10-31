import { LanguageCode } from '@marriage/shared';
import type { SpokePageConfig } from './types';

export const formatPdf: SpokePageConfig = {
  id: 'P04',
  path: '/marriage-biodata-format-pdf/',
  segments: ['marriage-biodata-format-pdf'],
  pageSlug: 'marriage-biodata-format-pdf',
  kind: 'spoke',
  week: 2,
  plannedDate: '2026-11-09',
  published: false,
  hub: 'Formats',
  intent: 'format-pdf',
  language: 'en',
  primaryKeyword: 'marriage biodata format pdf',
  secondaryKeywords: [
    'biodata pdf',
    'biodata for marriage pdf',
    'blank biodata form pdf',
  ],
  title: 'Marriage Biodata Format PDF: Free Samples to Download',
  metaDescription:
    'Download free marriage biodata PDFs: filled samples for boy and girl, and a blank form to print. Or make your own PDF online in 2 minutes.',
  h1: 'Marriage Biodata Format in PDF',
  breadcrumbName: 'PDF format',
  makerPosition: 'afterDownloads',
  preset: {
    designSlug: 'zari-traditional',
    exportLanguage: LanguageCode.EN,
    format: 'pdf',
    ctaLabel: 'Download PDF',
  },
  intro:
    'Download a filled sample to see what goes where, or a blank form to print and fill by pen. To get your own details in a finished PDF, use the maker below; it takes about two minutes.',
  downloadsHeading: 'Download biodata PDFs',
  outlineH2s: [
    'Download biodata PDFs',
    'Why share your biodata as a PDF',
    'How to send a PDF biodata on WhatsApp',
    'How to print your biodata',
    'Filling the blank form by hand',
  ],
  steps: [],
  samples: {
    heading: '',
    qualifier: '',
    count: 0,
  },
  sampleDownloads: [
    {
      label: 'Sample-biodata-boy.pdf',
      holds: 'Filled example for an invented groom, Zari design',
      href: '/downloads/Sample-biodata-boy.pdf',
      buttonLabel: 'Download PDF',
      previewSrc: '/samples/marriage-biodata-format-pdf/sample-boy.webp',
      previewAlt: 'Sample marriage biodata PDF for boy, traditional design',
    },
    {
      label: 'Sample-biodata-girl.pdf',
      holds: 'Filled example for an invented bride, Panna design',
      href: '/downloads/Sample-biodata-girl.pdf',
      buttonLabel: 'Download PDF',
      previewSrc: '/samples/marriage-biodata-format-pdf/sample-girl.webp',
      previewAlt:
        'Sample marriage biodata PDF for girl, green and gold design',
    },
    {
      label: 'Blank-biodata-form.pdf',
      holds: 'Labels with empty lines, for filling by hand',
      href: '/downloads/Blank-biodata-form.pdf',
      buttonLabel: 'Download PDF',
      previewSrc: '/samples/marriage-biodata-format-pdf/blank-form.webp',
      previewAlt: 'Blank marriage biodata form PDF to print and fill by hand',
    },
  ],
  tips: [],
  sections: [
    {
      id: 'why-pdf',
      h2: 'Why share your biodata as a PDF',
      paras: [
        'A PDF looks the same on every phone, laptop and printer. Fonts, borders and your photo stay exactly where you put them, which a Word file or a screenshot can’t promise. Matrimony sites and print shops both accept PDFs.',
      ],
    },
    {
      id: 'whatsapp',
      h2: 'How to send a PDF biodata on WhatsApp',
      ordered: true,
      list: [
        'Open the chat and tap the attachment icon.',
        'Choose Document, not Gallery.',
        'Pick your biodata PDF and send.',
      ],
      after: [
        'Sent as a document, the file keeps its full quality. Sent as a photo or screenshot, WhatsApp compresses it and small text blurs. Our maker also gives you a phone-sized image for people who prefer to open pictures.',
      ],
      image: {
        src: '/samples/marriage-biodata-format-pdf/whatsapp-document.webp',
        alt: 'Sending a biodata PDF on WhatsApp as a document',
      },
    },
    {
      id: 'print',
      h2: 'How to print your biodata',
      list: [
        'Print on A4 paper, one side only.',
        'Colour is best for traditional designs; every design also reads clearly in black and white.',
        'At a print shop, ask for “actual size” or “100%” so the border isn’t cut.',
        'Keep a few copies ready; relatives often ask for one at functions.',
      ],
    },
    {
      id: 'by-hand',
      h2: 'Filling the blank form by hand',
      hideUnlinked: true,
      paras: [
        'Write in capital letters with a black pen and leave a line blank rather than crossing it out. For a cleaner result, type the same details into the [[P01|online biodata maker]] and print that instead.',
        'Want a file you can edit on the computer? Use the [[P03|biodata format in Word]].',
      ],
    },
  ],
  faqs: [
    {
      q: 'Can I edit a biodata PDF?',
      a: 'Not easily. Make your biodata in the maker instead; you can change any detail and download a fresh PDF.',
    },
    {
      q: 'What size is the biodata PDF?',
      a: 'A4 (210 × 297 mm), the size families print and matrimony sites accept.',
    },
    {
      q: 'Why does my biodata look blurry on WhatsApp?',
      a: 'It was probably sent as a photo. Send the PDF as a Document instead.',
    },
    {
      q: 'Is there a PDF format in Hindi?',
      a: 'You can [[P09|make your biodata in Hindi]] and download it as a PDF.',
    },
  ],
  relatedIds: ['P01', 'P03', 'P05', 'P06', 'P09'],
};
