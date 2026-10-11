import {
  DEFAULT_EDITOR_SECTIONS,
  EDITOR_SECTIONS_KEY,
  type EditorSectionDef,
} from './editorSectionModel';

export function loadEditorSections(): EditorSectionDef[] {
  if (typeof window === 'undefined') return DEFAULT_EDITOR_SECTIONS;
  try {
    const raw = localStorage.getItem(EDITOR_SECTIONS_KEY);
    if (!raw) return DEFAULT_EDITOR_SECTIONS;
    const parsed = JSON.parse(raw) as EditorSectionDef[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* ignore */
  }
  return DEFAULT_EDITOR_SECTIONS;
}
