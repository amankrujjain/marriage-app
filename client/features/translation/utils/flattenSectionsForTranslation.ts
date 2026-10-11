import type { StructuredFields } from '@marriage/shared';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import { editorFieldKey } from './flattenEditorCustomFields';

/**
 * Flatten what the A4 preview actually shows (editor section values).
 * Synced fields use content paths (personal.fullName); custom fields use editor.* keys.
 */
export function flattenSectionsForTranslation(
  sections: EditorSectionDef[],
): StructuredFields {
  const fields: StructuredFields = {};

  for (const section of sections) {
    for (const field of section.fields) {
      const text = field.value.trim();
      if (!text) continue;
      if (field.sync) {
        fields[field.sync] = text;
      } else {
        fields[editorFieldKey(section.id, field.id)] = text;
      }
    }
  }

  return fields;
}
