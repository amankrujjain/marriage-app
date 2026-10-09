export type DemoTpl = 'zari' | 'panna' | 'kagaz';

export type DemoField = {
  label: string;
  value: string;
};

export type DemoSection = {
  title: string;
  fields: DemoField[];
};

export type DemoState = {
  tpl: DemoTpl;
  mantra: string;
  docTitle: string;
  name: string;
  photo: string;
  sections: DemoSection[];
};

export const MANTRA_OPTIONS = [
  '॥ श्री गणेशाय नमः ॥',
  '॥ ॐ नमः शिवाय ॥',
  '॥ जय श्री कृष्ण ॥',
  '॥ जय श्री राम ॥',
  'بِسْمِ ٱللَّٰهِ',
  'ੴ ਸਤਿ ਨਾਮੁ',
  '',
] as const;

export const DEMO_DRAFT_KEY = 'biodata-demo-draft';
