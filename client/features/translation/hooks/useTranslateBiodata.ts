'use client';

import { useCallback } from 'react';
import {
  applyTranslatedFields,
  LanguageCode,
  type BiodataContent,
  type StructuredFields,
} from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { loadEditorSections } from '@/features/biodata/components/editor/loadEditorSections';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import { translateFields } from '../services/translationApi';
import { flattenSectionsForTranslation } from '../utils/flattenSectionsForTranslation';
import {
  translationFailed,
  translationStarted,
  translationSucceeded,
} from '../store/languageSlice';

function splitTranslatedFields(fields: StructuredFields): {
  contentFields: StructuredFields;
  extras: StructuredFields;
} {
  const contentFields: StructuredFields = {};
  const extras: StructuredFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (key.startsWith('editor.')) extras[key] = value;
    else contentFields[key] = value;
  }
  return { contentFields, extras };
}

export function useTranslateBiodata() {
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.biodata.content);
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);

  const translate = useCallback(
    async (sections?: EditorSectionDef[]): Promise<BiodataContent | null> => {
      const editorSections = sections ?? loadEditorSections();
      const fields = flattenSectionsForTranslation(editorSections);

      if (exportLanguage === LanguageCode.EN) {
        dispatch(
          translationSucceeded({
            content,
            extras: {},
            cached: false,
            provider: 'passthrough',
          }),
        );
        return content;
      }

      if (Object.keys(fields).length === 0) {
        dispatch(
          translationSucceeded({
            content,
            extras: {},
            cached: false,
            provider: 'passthrough',
          }),
        );
        return content;
      }

      dispatch(translationStarted());
      try {
        const result = await translateFields({
          fields,
          targetLanguage: exportLanguage,
          sourceLanguage: LanguageCode.EN,
        });
        const { contentFields, extras } = splitTranslatedFields(result.fields);
        const nextContent = applyTranslatedFields(content, contentFields);
        dispatch(
          translationSucceeded({
            content: nextContent,
            extras,
            cached: result.cached,
            provider: result.provider,
          }),
        );
        return nextContent;
      } catch (error) {
        const message =
          error instanceof ApiClientError || error instanceof Error
            ? error.message
            : 'Translation failed';
        dispatch(translationFailed(message));
        return null;
      }
    },
    [content, dispatch, exportLanguage],
  );

  return { translate };
}
