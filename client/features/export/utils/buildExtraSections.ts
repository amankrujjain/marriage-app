import type { BiodataContent, DocumentExtraSection, StructuredFields } from '@marriage/shared';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import { editorFieldKey } from '@/features/translation/utils/flattenEditorCustomFields';

/**
 * Unsynced editor fields with values → document export extras.
 * Uses translated extras when present; skips hidden fields.
 */
export function buildExtraSections(
  sections: EditorSectionDef[],
  content: BiodataContent,
  translatedExtras?: StructuredFields | null,
): DocumentExtraSection[] {
  const hidden = new Set(content.hiddenFields ?? []);
  const extras: DocumentExtraSection[] = [];

  for (const section of sections) {
    const lines: DocumentExtraSection['lines'] = [];
    for (const field of section.fields) {
      if (field.sync) continue;
      const key = editorFieldKey(section.id, field.id);
      if (hidden.has(key) || hidden.has(field.id)) continue;
      const source = field.value.trim();
      if (!source) continue;
      const translated = translatedExtras?.[key];
      const value =
        typeof translated === 'string' && translated.trim()
          ? translated.trim()
          : source;
      lines.push({
        label: field.label.trim().slice(0, 80) || 'Field',
        value: value.slice(0, 500),
      });
    }
    if (lines.length === 0) continue;
    extras.push({
      title: section.title.trim().slice(0, 80) || 'Details',
      lines: lines.slice(0, 30),
    });
    if (extras.length >= 12) break;
  }

  return extras;
}
