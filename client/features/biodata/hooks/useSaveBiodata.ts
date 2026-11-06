'use client';

import { useCallback } from 'react';
import {
  mergeSectionsIntoContent,
  type BiodataContent,
  type BiodataEditorSection,
} from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { normalizeDateStorage } from '@/lib/formatDate';
import { slugFromTemplateId } from '../components/editor/designMap';
import { createBiodata, updateBiodata } from '../services/biodataApi';
import { saveFailed, saveStarted, saveSucceeded } from '../store/biodataSlice';

function asString(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

/** Make editor sections safe for the API schema (no nulls / missing value). */
function sanitizeEditorSections(
  sections: BiodataEditorSection[] | null | undefined,
): BiodataEditorSection[] | undefined {
  if (!sections?.length) return undefined;
  return sections.map((section) => ({
    id: asString(section.id),
    title: asString(section.title) || 'Section',
    blurb: asString(section.blurb),
    custom: section.custom === true ? true : undefined,
    fields: (section.fields ?? []).map((field) => {
      const sync = field.sync ? asString(field.sync) : undefined;
      let value = asString(field.value);
      if (sync === 'personal.dateOfBirth' || field.type === 'date') {
        value = normalizeDateStorage(value) || value;
      }
      return {
        id: asString(field.id),
        label: asString(field.label) || 'Field',
        value,
        hint: field.hint != null ? asString(field.hint) : undefined,
        placeholder:
          field.placeholder != null ? asString(field.placeholder) : undefined,
        type: field.type != null ? asString(field.type) : undefined,
        wide: field.wide === true ? true : undefined,
        sync: sync || undefined,
      };
    }),
  }));
}

function sanitizeContent(content: BiodataContent, designSlug?: string): BiodataContent {
  const personal = { ...content.personal };
  if (personal.dateOfBirth) {
    personal.dateOfBirth =
      normalizeDateStorage(personal.dateOfBirth) || personal.dateOfBirth;
  }
  // Drop non-numeric age so Joi number() doesn't see "".
  if (
    personal.age !== undefined &&
    (typeof personal.age !== 'number' || Number.isNaN(personal.age))
  ) {
    delete personal.age;
  }

  return {
    ...content,
    personal,
    designSlug: designSlug || content.designSlug,
    hiddenFields: Array.isArray(content.hiddenFields) ? content.hiddenFields : [],
  };
}

export function useSaveBiodata() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const biodataId = useAppSelector((state) => state.biodata.biodataId);
  const title = useAppSelector((state) => state.biodata.title);
  const content = useAppSelector((state) => state.biodata.content);
  const editorSections = useAppSelector((state) => state.biodata.editorSections);
  const savedSlug = useAppSelector((state) => state.biodata.designSlug);
  const designSlug = useAppSelector(
    (state) =>
      state.template.selectedDesignSlug ||
      savedSlug ||
      slugFromTemplateId(state.template.selectedTemplateId),
  );

  /** Persist draft. Guests stay local-only. Returns false when cloud save fails. */
  const save = useCallback(async (): Promise<boolean> => {
    if (authStatus !== 'authenticated') {
      dispatch(
        saveSucceeded({ id: biodataId ?? 'local-draft', title: title || 'Draft' }),
      );
      return true;
    }
    dispatch(saveStarted());
    try {
      const sections = sanitizeEditorSections(editorSections);
      const merged = mergeSectionsIntoContent(content, sections);
      const payload = {
        title: title?.trim() || undefined,
        content: sanitizeContent(merged, designSlug || undefined),
        designSlug: designSlug || undefined,
        editorSections: sections,
      };
      const record =
        biodataId && biodataId !== 'local-draft'
          ? await updateBiodata(biodataId, payload)
          : await createBiodata(payload);
      dispatch(saveSucceeded({ id: record.id, title: record.title }));
      return true;
    } catch (error) {
      const message =
        error instanceof ApiClientError || error instanceof Error
          ? error.message
          : 'Could not save biodata';
      dispatch(saveFailed(message));
      return false;
    }
  }, [
    authStatus,
    biodataId,
    title,
    content,
    editorSections,
    designSlug,
    dispatch,
  ]);

  return { save };
}
