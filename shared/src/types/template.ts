import type { LanguageCode } from '../enums/LanguageCode';
import type { TemplateCategory } from '../enums/TemplateCategory';
import type { TemplateId } from '../enums/TemplateId';
import type { TemplateSection } from '../enums/TemplateSection';

export type TemplateLayout =
  | 'classic-portrait'
  | 'modern-split'
  | 'elegant-center'
  | 'minimal-stack'
  | 'royal-frame'
  | 'floral-card';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  description: string;
  previewTone: string;
  supportedLanguages: LanguageCode[];
  layout: TemplateLayout;
  sections: TemplateSection[];
}
