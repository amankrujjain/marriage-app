import type { BiodataContent, StructuredFields } from '@marriage/shared';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import type { PreviewSectionInput } from '@/features/demo/mapBiodataToDemo';
import { editorFieldKey } from './flattenEditorCustomFields';

function readSyncedValue(content: BiodataContent, sync: string): string {
  const [group, key] = sync.split('.');
  if (!group || !key) return '';
  const bucket = content[group as keyof BiodataContent];
  if (!bucket || typeof bucket !== 'object') return '';
  const value = (bucket as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : value != null ? String(value) : '';
}

/**
 * Keeps English section titles and field labels; swaps values from translated
 * content (synced fields) and translatedExtras (custom unsynced fields).
 */
export function applyTranslatedValuesToSections(
  sections: EditorSectionDef[],
  translated: BiodataContent,
  extras: StructuredFields = {},
): PreviewSectionInput[] {
  return sections.map((section) => ({
    title: section.title,
    fields: section.fields.map((field) => {
      if (field.sync) {
        return {
          label: field.label,
          value: readSyncedValue(translated, field.sync) || field.value,
        };
      }
      const key = editorFieldKey(section.id, field.id);
      return {
        label: field.label,
        value: extras[key] ?? field.value,
      };
    }),
  }));
}
