import type { BiodataContent } from '../types/biodata';
import type { StructuredFields } from '../types/translation';

export function applyTranslatedFields(
  original: BiodataContent,
  fields: StructuredFields,
): BiodataContent {
  const next: BiodataContent = {
    personal: { ...original.personal },
    education: { ...original.education },
    career: { ...original.career },
    family: { ...original.family },
    about: { ...original.about },
    contact: { ...original.contact },
    profilePhotoUrl: original.profilePhotoUrl,
    hiddenFields: [...original.hiddenFields],
  };

  for (const [path, value] of Object.entries(fields)) {
    const [section, key] = path.split('.');
    if (!section || !key) continue;
    const bucket = next[section as keyof BiodataContent];
    if (typeof bucket === 'object' && bucket !== null && !Array.isArray(bucket)) {
      (bucket as Record<string, string>)[key] = value;
    }
  }

  return next;
}
