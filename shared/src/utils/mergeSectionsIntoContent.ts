import type { BiodataContent } from '../types/biodata';
import type { BiodataEditorSection } from '../types/biodataEditor';

const CONTENT_GROUPS = [
  'personal',
  'education',
  'career',
  'family',
  'about',
  'contact',
] as const;

type ContentGroup = (typeof CONTENT_GROUPS)[number];

function isContentGroup(value: string): value is ContentGroup {
  return (CONTENT_GROUPS as readonly string[]).includes(value);
}

/** Copy synced editor field values into structured biodata content. */
export function mergeSectionsIntoContent(
  content: BiodataContent,
  sections: BiodataEditorSection[] | undefined | null,
): BiodataContent {
  if (!sections?.length) return content;

  const next: BiodataContent = {
    ...content,
    personal: { ...content.personal },
    education: { ...content.education },
    career: { ...content.career },
    family: { ...content.family },
    about: { ...content.about },
    contact: { ...content.contact },
    hiddenFields: [...(content.hiddenFields ?? [])],
  };

  for (const section of sections) {
    for (const field of section.fields) {
      if (!field.sync) continue;
      const [group, key] = field.sync.split('.');
      if (!group || !key || !isContentGroup(group)) continue;
      const bucket = next[group] as Record<string, unknown>;
      bucket[key] = field.value;
    }
  }

  return next;
}
