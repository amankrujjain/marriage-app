import type { BiodataContent } from '../types/biodata';
import type { StructuredFields } from '../types/translation';

const SECTIONS = [
  'personal',
  'education',
  'career',
  'family',
  'about',
  'contact',
] as const;

export function flattenBiodataFields(content: BiodataContent): StructuredFields {
  const fields: StructuredFields = {};

  for (const section of SECTIONS) {
    const data = content[section] as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;
      const text = String(value).trim();
      if (!text) continue;
      fields[`${section}.${key}`] = text;
    }
  }

  return fields;
}
