export type GalleryStyle = 'Traditional' | 'Royal' | 'Floral' | 'Modern';
export type GalleryCommunity = 'Hindu' | 'Muslim' | 'Sikh' | 'Jain' | 'Christian' | 'Any';
export type GalleryPages = '1 page' | '2 pages';
export type GalleryTier = 'Free' | 'Premium';
export type GalleryPreview =
  | 'zari'
  | 'panna'
  | 'genda'
  | 'gulab'
  | 'neelkanth'
  | 'khalsa'
  | 'kagaz'
  | 'slate';

export type GalleryTemplate = {
  id: string;
  name: string;
  style: GalleryStyle;
  communities: GalleryCommunity[];
  pages: GalleryPages;
  hasPhoto: boolean;
  tier: GalleryTier;
  blessing: string;
  accent: string;
  lineBg: string;
  photoRadius: string;
  preview: GalleryPreview;
  meta: string;
};

export const GALLERY_TEMPLATES: GalleryTemplate[] = [
  {
    id: 'zari',
    name: 'Zari',
    style: 'Traditional',
    communities: ['Hindu'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Free',
    blessing: '॥ श्री गणेशाय नमः ॥',
    accent: '#7A1F2B',
    lineBg: '#E8D8C2',
    photoRadius: '2px',
    preview: 'zari',
    meta: 'Traditional · 1 page',
  },
  {
    id: 'zari-do-patra',
    name: 'Zari Do-Patra',
    style: 'Traditional',
    communities: ['Hindu'],
    pages: '2 pages',
    hasPhoto: true,
    tier: 'Premium',
    blessing: '॥ श्री गणेशाय नमः ॥',
    accent: '#7A1F2B',
    lineBg: '#E8D8C2',
    photoRadius: '2px',
    preview: 'zari',
    meta: 'Traditional · 2 pages',
  },
  {
    id: 'panna',
    name: 'Panna',
    style: 'Royal',
    communities: ['Muslim', 'Any'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Premium',
    blessing: 'بِسْمِ ٱللَّٰهِ',
    accent: '#0F4D36',
    lineBg: '#E2DCC7',
    photoRadius: '27px 27px 2px 2px',
    preview: 'panna',
    meta: 'Royal · 1 page',
  },
  {
    id: 'panna-sada',
    name: 'Panna Sada',
    style: 'Royal',
    communities: ['Muslim', 'Any'],
    pages: '1 page',
    hasPhoto: false,
    tier: 'Premium',
    blessing: '',
    accent: '#0F4D36',
    lineBg: '#E2DCC7',
    photoRadius: '27px 27px 2px 2px',
    preview: 'panna',
    meta: 'Royal · 1 page · no photo',
  },
  {
    id: 'genda',
    name: 'Genda',
    style: 'Floral',
    communities: ['Hindu', 'Jain'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Premium',
    blessing: '॥ जय श्री कृष्ण ॥',
    accent: '#9A3412',
    lineBg: '#F1DDBE',
    photoRadius: '50%',
    preview: 'genda',
    meta: 'Floral · 1 page',
  },
  {
    id: 'gulab',
    name: 'Gulab',
    style: 'Floral',
    communities: ['Any'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Premium',
    blessing: '',
    accent: '#8E2F48',
    lineBg: '#F2D9DF',
    photoRadius: '50%',
    preview: 'gulab',
    meta: 'Floral · 1 page',
  },
  {
    id: 'neelkanth',
    name: 'Neelkanth',
    style: 'Royal',
    communities: ['Hindu'],
    pages: '2 pages',
    hasPhoto: true,
    tier: 'Premium',
    blessing: '॥ ॐ नमः शिवाय ॥',
    accent: '#1E3A8A',
    lineBg: '#DCE0EE',
    photoRadius: '2px',
    preview: 'neelkanth',
    meta: 'Royal · 2 pages',
  },
  {
    id: 'khalsa',
    name: 'Khalsa',
    style: 'Traditional',
    communities: ['Sikh'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Premium',
    blessing: 'ੴ ਸਤਿ ਨਾਮੁ',
    accent: '#1E3A8A',
    lineBg: '#F0E2C6',
    photoRadius: '2px',
    preview: 'khalsa',
    meta: 'Traditional · 1 page',
  },
  {
    id: 'kagaz',
    name: 'Kagaz',
    style: 'Modern',
    communities: ['Any', 'Christian'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Free',
    blessing: '',
    accent: '#1F2226',
    lineBg: '#E8E4E1',
    photoRadius: '3px',
    preview: 'kagaz',
    meta: 'Modern · 1 page',
  },
  {
    id: 'kagaz-bina-photo',
    name: 'Kagaz Bina Photo',
    style: 'Modern',
    communities: ['Any', 'Christian'],
    pages: '1 page',
    hasPhoto: false,
    tier: 'Free',
    blessing: '',
    accent: '#1F2226',
    lineBg: '#E8E4E1',
    photoRadius: '3px',
    preview: 'kagaz',
    meta: 'Modern · 1 page · no photo',
  },
  {
    id: 'slate',
    name: 'Slate',
    style: 'Modern',
    communities: ['Any', 'Christian'],
    pages: '2 pages',
    hasPhoto: true,
    tier: 'Premium',
    blessing: '',
    accent: '#2C3A45',
    lineBg: '#DDE1E4',
    photoRadius: '3px',
    preview: 'slate',
    meta: 'Modern · 2 pages',
  },
  {
    id: 'jinvani',
    name: 'Jinvani',
    style: 'Floral',
    communities: ['Jain'],
    pages: '1 page',
    hasPhoto: true,
    tier: 'Premium',
    blessing: '॥ जय जिनेन्द्र ॥',
    accent: '#9A3412',
    lineBg: '#F1DDBE',
    photoRadius: '2px',
    preview: 'genda',
    meta: 'Floral · 1 page',
  },
];

export const STYLE_FILTERS = ['All', 'Traditional', 'Royal', 'Floral', 'Modern'] as const;
export const COMMUNITY_FILTERS = [
  'All',
  'Hindu',
  'Muslim',
  'Sikh',
  'Jain',
  'Christian',
  'Any',
] as const;
export const LAYOUT_FILTERS = ['All', '1 page', '2 pages', 'Without photo'] as const;
