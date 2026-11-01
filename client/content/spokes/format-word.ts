import { LanguageCode } from '@marriage/shared';
import type { SpokePageConfig } from './types';

export const formatWord: SpokePageConfig = {
  id: 'P03',
  path: '/marriage-biodata-format-word/',
  segments: ['marriage-biodata-format-word'],
  pageSlug: 'marriage-biodata-format-word',
  kind: 'spoke',
  week: 2,
  plannedDate: '2026-11-09',
  published: true,
  hub: 'Formats',
  intent: 'format-word',
  language: 'en',
  primaryKeyword: 'marriage biodata format in word',
  secondaryKeywords: [
    'biodata format in word',
    'biodata word file download',
    'editable biodata format',
  ],
  title: 'Marriage Biodata Format in Word: Free .docx Download',
  metaDescription:
    'Download a free marriage biodata format in Word. Editable .docx files with and without photo, in English and Hindi. Or fill it online and get a PDF.',
  h1: 'Marriage Biodata Format in Word (Free Download)',
  breadcrumbName: 'Word format',
  makerPosition: 'afterDownloads',
  preset: {
    designSlug: 'kagaz-modern',
    exportLanguage: LanguageCode.EN,
    format: 'docx',
  },
  intro:
    'Download a marriage biodata format in Word, fill in your details and save it as a PDF. All three files are free and work in Microsoft Word, Google Docs and WPS Office on your phone.',
  downloadsHeading: 'Download the biodata format in Word',
  outlineH2s: [
    'Download the biodata format in Word',
    'How to fill in the Word format',
    'Word file or online maker?',
    'Common problems with Word biodatas',
  ],
  steps: [],
  samples: {
    heading: '',
    qualifier: '',
    count: 0,
  },
  sampleDownloads: [
    {
      label: 'Biodata-format-traditional-with-photo.docx',
      holds: 'Zari-style border, photo box, all standard fields',
      href: '/downloads/Biodata-format-traditional-with-photo.docx',
      buttonLabel: 'Download .docx',
      previewSrc:
        '/samples/marriage-biodata-format-word/traditional-with-photo.webp',
      previewAlt:
        'Marriage biodata format in Word with photo, traditional border',
    },
    {
      label: 'Biodata-format-simple-without-photo.docx',
      holds: 'Plain layout, no photo, all standard fields',
      href: '/downloads/Biodata-format-simple-without-photo.docx',
      buttonLabel: 'Download .docx',
      previewSrc:
        '/samples/marriage-biodata-format-word/simple-without-photo.webp',
      previewAlt: 'Simple marriage biodata format in Word without photo',
    },
    {
      label: 'Biodata-format-hindi.docx',
      holds: 'Same simple layout with Hindi labels',
      href: '/downloads/Biodata-format-hindi.docx',
      buttonLabel: 'Download .docx',
      previewSrc: '/samples/marriage-biodata-format-word/hindi.webp',
      previewAlt: 'Marriage biodata format in Word in Hindi',
    },
  ],
  tips: [],
  sections: [
    {
      id: 'fill',
      h2: 'How to fill in the Word format',
      ordered: true,
      list: [
        'Open the file in Word, Google Docs or WPS Office.',
        'Click on each sample value and type over it. Leave the label column as it is.',
        'Delete any row you don’t need, such as blood group or complexion.',
        'To add your photo, click the photo box, then Insert, Picture. Use a clear portrait.',
        'Save it as a PDF before you share it. Word files often shift their layout on other phones; a PDF looks the same everywhere.',
      ],
      image: {
        src: '/samples/marriage-biodata-format-word/wps-office-phone.webp',
        alt: 'Editing a marriage biodata Word file on a mobile phone',
      },
    },
    {
      id: 'word-vs-maker',
      h2: 'Word file or online maker?',
      table: {
        head: ['', 'Word file', 'Online maker'],
        rows: [
          ['Time to finish', '15 to 30 minutes', 'About 2 minutes'],
          ['Designs', '3 simple layouts', 'Every design on the site'],
          ['Photo', 'Insert and resize yourself', 'Cropped to fit automatically'],
          ['Fits one page', 'You adjust spacing', 'Text resizes automatically'],
          ['Output', '.docx you save as PDF', 'PDF plus WhatsApp image'],
        ],
      },
      after: [
        'If you just want the finished PDF, [[P01|make your biodata online]] instead. Your details appear on the design as you type.',
      ],
    },
    {
      id: 'problems',
      h2: 'Common problems with Word biodatas',
      list: [
        'The layout shifts on someone else’s phone. Share the PDF, never the .docx.',
        'Hindi text shows as boxes. The other phone lacks the font. Saving as a PDF embeds it.',
        'The photo spills onto page two. Make the photo smaller, or crop it to a portrait shape before inserting it.',
        'The page runs long. Remove rows you don’t need, or use the [[P04|biodata format in PDF]] samples for a layout that already fits one page.',
      ],
    },
  ],
  faqs: [
    {
      q: 'Is the Word biodata format free?',
      a: 'Yes. All three .docx files are free to download and use.',
    },
    {
      q: 'Can I edit the Word format on my phone?',
      a: 'Yes. Open it in Google Docs, Microsoft Word or WPS Office, all free apps.',
    },
    {
      q: 'Should I send the Word file or a PDF?',
      a: 'Send a PDF. A Word file can change its layout on another phone; a PDF looks the same everywhere.',
    },
    {
      q: 'Is there a Word format in Hindi?',
      a: 'Yes. The Hindi .docx has Hindi labels. You can also [[P09|make your biodata in Hindi]] online.',
    },
  ],
  relatedIds: ['P01', 'P04', 'P02', 'P09'],
};
