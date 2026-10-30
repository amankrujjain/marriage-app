import type { BiodataContent } from '@marriage/shared';
import {
  countFilled,
  EDITOR_SECTIONS_KEY,
  type EditorSectionDef,
} from '@/features/biodata/components/editor/editorSectionModel';

function groupHasValues(group: object | undefined): boolean {
  if (!group) return false;
  for (const value of Object.values(group)) {
    if (typeof value === 'string' && value.trim()) return true;
  }
  return false;
}

/** True when Redux biodata content has no user-entered field values. */
export function isContentEmpty(content: BiodataContent): boolean {
  if (content.profilePhotoUrl) return false;
  return !(
    groupHasValues(content.personal) ||
    groupHasValues(content.education) ||
    groupHasValues(content.career) ||
    groupHasValues(content.family) ||
    groupHasValues(content.about) ||
    groupHasValues(content.contact)
  );
}

function loadDraftSections(biodataId: string | null): EditorSectionDef[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(
      `${EDITOR_SECTIONS_KEY}:${biodataId || 'draft'}`,
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EditorSectionDef[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

/** True when localStorage draft sections have any filled field values. */
export function hasFilledStoredSections(biodataId: string | null): boolean {
  const stored = loadDraftSections(biodataId);
  if (!stored) return false;
  return stored.some((section) => countFilled(section.fields).filled > 0);
}

/**
 * Empty draft for spoke presets: no saved biodata, no filled editor fields
 * in Redux or localStorage. Caller also checks `?id` / `?design`.
 */
export function isEmptyDraft(
  content: BiodataContent,
  biodataId: string | null,
): boolean {
  if (biodataId) return false;
  if (!isContentEmpty(content)) return false;
  if (hasFilledStoredSections(biodataId)) return false;
  return true;
}
