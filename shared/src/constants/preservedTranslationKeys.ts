/**
 * Biodata paths whose values should not be machine-translated
 * (personal / family / contact names stay as the user typed them).
 */
export const PRESERVED_TRANSLATION_KEYS = [
  'personal.fullName',
  'family.fatherName',
  'family.motherName',
  'contact.contactName',
] as const;

export type PreservedTranslationKey = (typeof PRESERVED_TRANSLATION_KEYS)[number];

export const PRESERVED_TRANSLATION_KEY_SET = new Set<string>(PRESERVED_TRANSLATION_KEYS);
