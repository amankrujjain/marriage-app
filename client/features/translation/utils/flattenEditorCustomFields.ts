import type { StructuredFields } from '@marriage/shared';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';

/** Unsynced custom editor fields → `editor.{sectionId}.{fieldId}`. */
export function flattenEditorCustomFields(
  sections: EditorSectionDef[],
): StructuredFields {
  const fields: StructuredFields = {};

  for (const section of sections) {
    for (const field of section.fields) {
      if (field.sync) continue;
      const text = field.value.trim();
      if (!text) continue;
      fields[`editor.${section.id}.${field.id}`] = text;
    }
  }

  return fields;
}

export function editorFieldKey(sectionId: string, fieldId: string): string {
  return `editor.${sectionId}.${fieldId}`;
}
