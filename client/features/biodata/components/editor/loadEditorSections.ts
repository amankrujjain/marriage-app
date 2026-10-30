import {
  DEFAULT_EDITOR_SECTIONS,
  EDITOR_SECTIONS_KEY,
  type EditorSectionDef,
} from './editorSectionModel';

/** Load editor sections; prefer per-draft key used by the live editor. */
export function loadEditorSections(): EditorSectionDef[] {
  if (typeof window === 'undefined') return DEFAULT_EDITOR_SECTIONS;
  try {
    for (const key of [`${EDITOR_SECTIONS_KEY}:draft`, EDITOR_SECTIONS_KEY]) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as EditorSectionDef[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_EDITOR_SECTIONS;
}
