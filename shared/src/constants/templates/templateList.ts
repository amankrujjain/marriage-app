import { LanguageCode } from '../../enums/LanguageCode';
import { TemplateCategory } from '../../enums/TemplateCategory';
import { TemplateId } from '../../enums/TemplateId';
import { TemplateSection } from '../../enums/TemplateSection';
import type { TemplateDefinition } from '../../types/template';

const ALL_SECTIONS: TemplateSection[] = [
  TemplateSection.PHOTO,
  TemplateSection.PERSONAL,
  TemplateSection.EDUCATION,
  TemplateSection.CAREER,
  TemplateSection.FAMILY,
  TemplateSection.ABOUT,
  TemplateSection.CONTACT,
];

const INDIAN_LANGS = [
  LanguageCode.EN,
  LanguageCode.HI,
  LanguageCode.BN,
  LanguageCode.MR,
  LanguageCode.GU,
  LanguageCode.PA,
  LanguageCode.TA,
  LanguageCode.TE,
  LanguageCode.KN,
];

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: TemplateId.TRADITIONAL_MAROON,
    name: 'Maroon Classic',
    category: TemplateCategory.TRADITIONAL,
    description: 'Classic shaadi invitation feel with deep maroon borders.',
    previewTone: '#6b1e2f',
    supportedLanguages: INDIAN_LANGS,
    layout: 'classic-portrait',
    sections: ALL_SECTIONS,
  },
  {
    id: TemplateId.MODERN_CLEAN,
    name: 'Modern Clean',
    category: TemplateCategory.MODERN,
    description: 'Airy layout with clear sections for city professionals.',
    previewTone: '#2c2421',
    supportedLanguages: INDIAN_LANGS,
    layout: 'modern-split',
    sections: ALL_SECTIONS,
  },
  {
    id: TemplateId.ELEGANT_SERIF,
    name: 'Elegant Serif',
    category: TemplateCategory.ELEGANT,
    description: 'Soft typography and generous spacing.',
    previewTone: '#8a5a44',
    supportedLanguages: INDIAN_LANGS,
    layout: 'elegant-center',
    sections: ALL_SECTIONS,
  },
  {
    id: TemplateId.MINIMAL_LINE,
    name: 'Minimal Line',
    category: TemplateCategory.MINIMAL,
    description: 'Quiet lines and focused essentials.',
    previewTone: '#5c5c5c',
    supportedLanguages: INDIAN_LANGS,
    layout: 'minimal-stack',
    sections: ALL_SECTIONS,
  },
  {
    id: TemplateId.ROYAL_GOLD,
    name: 'Royal Gold',
    category: TemplateCategory.ROYAL,
    description: 'Gold accents for a festive royal look.',
    previewTone: '#c4a35a',
    supportedLanguages: INDIAN_LANGS,
    layout: 'royal-frame',
    sections: ALL_SECTIONS,
  },
  {
    id: TemplateId.FLORAL_SOFT,
    name: 'Floral Soft',
    category: TemplateCategory.FLORAL,
    description: 'Gentle floral borders with a warm blush base.',
    previewTone: '#c47a7a',
    supportedLanguages: INDIAN_LANGS,
    layout: 'floral-card',
    sections: ALL_SECTIONS,
  },
];
