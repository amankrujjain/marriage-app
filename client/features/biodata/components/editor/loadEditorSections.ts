import {
  DEFAULT_EDITOR_SECTIONS,
  EDITOR_SECTIONS_KEY,
  type EditorSectionDef,
} from './editorSectionModel';

function tryParse(raw: string | null): EditorSectionDef[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as EditorSectionDef[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Load editor sections from localStorage.
 * Prefer the open biodata's key, then draft, then the legacy unsuffixed key.
 */
export function loadEditorSections(
  biodataId?: string | null,
): EditorSectionDef[] {
  if (typeof window === 'undefined') return DEFAULT_EDITOR_SECTIONS;
  const keys: string[] = [];
  if (biodataId) keys.push(`${EDITOR_SECTIONS_KEY}:${biodataId}`);
  keys.push(`${EDITOR_SECTIONS_KEY}:draft`, EDITOR_SECTIONS_KEY);
  for (const key of keys) {
    const parsed = tryParse(window.localStorage.getItem(key));
    if (parsed) return parsed;
  }
  return DEFAULT_EDITOR_SECTIONS;
}
