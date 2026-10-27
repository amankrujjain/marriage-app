'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BiodataContent } from '@marriage/shared';
import { normalizeDateStorage } from '@/lib/formatDate';
import { trackFormStarted } from '@/lib/analytics';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  patchAbout,
  patchCareer,
  patchContact,
  patchEducation,
  patchFamily,
  patchPersonal,
  setEditorSections,
} from '../../store/biodataSlice';
import {
  countFilled,
  createField,
  createSection,
  DEFAULT_EDITOR_SECTIONS,
  EDITOR_SECTIONS_KEY,
  type EditorFieldDef,
  type EditorSectionDef,
} from './editorSectionModel';

function readSyncedValue(content: BiodataContent, sync: string): string {
  const [group, key] = sync.split('.');
  if (!group || !key) return '';
  const bucket = content[group as keyof BiodataContent];
  if (!bucket || typeof bucket !== 'object') return '';
  const value = (bucket as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : value != null ? String(value) : '';
}

function isDateField(field: EditorFieldDef): boolean {
  return field.type === 'date' || field.sync === 'personal.dateOfBirth';
}

function normalizeFieldValue(field: EditorFieldDef): EditorFieldDef {
  if (!isDateField(field) || !field.value.trim()) return field;
  const normalized = normalizeDateStorage(field.value);
  return normalized ? { ...field, value: normalized } : field;
}

function hydrateFromContent(
  sections: EditorSectionDef[],
  content: BiodataContent,
): EditorSectionDef[] {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      const withSync = field.sync
        ? { ...field, value: readSyncedValue(content, field.sync) || field.value }
        : field;
      return normalizeFieldValue(withSync);
    }),
  }));
}

function storageKey(biodataId: string | null): string {
  return `${EDITOR_SECTIONS_KEY}:${biodataId || 'draft'}`;
}

function loadStored(biodataId: string | null): EditorSectionDef[] | null {
  try {
    const raw = localStorage.getItem(storageKey(biodataId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EditorSectionDef[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function useEditorSections() {
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.biodata.content);
  const biodataId = useAppSelector((state) => state.biodata.biodataId);
  const savedSections = useAppSelector((state) => state.biodata.editorSections);
  const [sections, setSections] = useState<EditorSectionDef[]>(DEFAULT_EDITOR_SECTIONS);
  const [openId, setOpenId] = useState('personal');
  const [reorderMode, setReorderMode] = useState(false);
  const [ready, setReady] = useState(false);
  const lastSourceKey = useRef<string>('');

  // Load sections whenever the active biodata / server snapshot changes.
  useEffect(() => {
    const hasServer = Boolean(savedSections && savedSections.length > 0);
    const sourceKey = `${biodataId || 'draft'}:${hasServer ? 'server' : 'local'}`;
    if (lastSourceKey.current === sourceKey) return;
    lastSourceKey.current = sourceKey;

    const base =
      (hasServer ? savedSections : null) ??
      loadStored(biodataId) ??
      DEFAULT_EDITOR_SECTIONS;
    const hydrated = hydrateFromContent(base!, content);
    setSections(hydrated);
    dispatch(setEditorSections(hydrated));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biodataId, savedSections]);

  // Persist to per-biodata local cache + Redux (for save payload).
  useEffect(() => {
    if (!ready) return;
    dispatch(setEditorSections(sections));
    try {
      localStorage.setItem(storageKey(biodataId), JSON.stringify(sections));
    } catch {
      /* ignore */
    }
  }, [sections, ready, biodataId, dispatch]);

  const syncToRedux = useCallback(
    (sync: string, value: string) => {
      const [group, key] = sync.split('.');
      if (!group || !key) return;
      const patch = { [key]: value } as Record<string, string>;
      switch (group) {
        case 'personal':
          dispatch(patchPersonal(patch));
          break;
        case 'education':
          dispatch(patchEducation(patch));
          break;
        case 'career':
          dispatch(patchCareer(patch));
          break;
        case 'family':
          dispatch(patchFamily(patch));
          break;
        case 'about':
          dispatch(patchAbout(patch));
          break;
        case 'contact':
          dispatch(patchContact(patch));
          break;
        default:
          break;
      }
    },
    [dispatch],
  );

  function toggleSection(id: string) {
    setOpenId((prev) => (prev === id ? prev : id));
    setReorderMode(false);
  }

  function updateField(sectionId: string, fieldId: string, next: Partial<EditorFieldDef>) {
    if (next.value !== undefined) {
      trackFormStarted();
    }
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          fields: section.fields.map((field) => {
            if (field.id !== fieldId) return field;
            let updated = { ...field, ...next };
            if (next.value !== undefined && isDateField(updated)) {
              updated = {
                ...updated,
                value: normalizeDateStorage(next.value) || next.value,
              };
            }
            if (updated.sync && next.value !== undefined) {
              syncToRedux(updated.sync, updated.value);
            }
            return updated;
          }),
        };
      }),
    );
  }

  function updateSectionTitle(sectionId: string, title: string) {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, title } : section)),
    );
  }

  function addField(sectionId: string) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, createField()] }
          : section,
      ),
    );
  }

  function removeField(sectionId: string, fieldId: string) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter((f) => f.id !== fieldId) }
          : section,
      ),
    );
  }

  function moveField(sectionId: string, fieldId: string, dir: -1 | 1) {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const idx = section.fields.findIndex((f) => f.id === fieldId);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= section.fields.length) return section;
        const a = section.fields[idx];
        const b = section.fields[target];
        if (!a || !b) return section;
        const fields = section.fields.map((f, i) => {
          if (i === idx) return b;
          if (i === target) return a;
          return f;
        });
        return { ...section, fields };
      }),
    );
  }

  function addSection() {
    const section = createSection('Partner expectations');
    setSections((prev) => [...prev, section]);
    setOpenId(section.id);
    setReorderMode(false);
  }

  function removeSection(sectionId: string) {
    setSections((prev) => {
      const section = prev.find((s) => s.id === sectionId);
      if (!section?.custom) return prev;
      const next = prev.filter((s) => s.id !== sectionId);
      if (openId === sectionId) setOpenId(next[0]?.id ?? 'personal');
      return next;
    });
  }

  const totals = sections.reduce(
    (acc, section) => {
      const c = countFilled(section.fields);
      acc.filled += c.filled;
      acc.total += c.total;
      return acc;
    },
    { filled: 0, total: 0 },
  );

  return {
    sections,
    openId,
    reorderMode,
    setReorderMode,
    toggleSection,
    updateField,
    updateSectionTitle,
    addField,
    removeField,
    moveField,
    addSection,
    removeSection,
    progressLabel: `${totals.filled} of ${totals.total} filled`,
    progressPct: totals.total === 0 ? 0 : Math.round((totals.filled / totals.total) * 100),
  };
}
