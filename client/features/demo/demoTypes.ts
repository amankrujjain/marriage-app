import type { ProfilePhotoFit } from '@marriage/shared';

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
  photoFit?: ProfilePhotoFit;
  sections: DemoSection[];
};
