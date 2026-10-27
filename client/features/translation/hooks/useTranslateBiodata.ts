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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const TRANSLATE_ATTEMPTS = 2;
const TRANSLATE_BACKOFF_MS = [400, 800];

export function useTranslateBiodata() {
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.biodata.content);
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);

  const translate = useCallback(
    async (sections?: EditorSectionDef[]): Promise<BiodataContent> => {
      const editorSections = sections ?? loadEditorSections();
      const fields = flattenSectionsForTranslation(editorSections);

      if (exportLanguage === LanguageCode.EN || Object.keys(fields).length === 0) {
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
      let lastMessage = 'Translation failed';

      for (let attempt = 0; attempt < TRANSLATE_ATTEMPTS; attempt += 1) {
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
          lastMessage =
            error instanceof ApiClientError || error instanceof Error
              ? error.message
              : 'Translation failed';
          const wait = TRANSLATE_BACKOFF_MS[attempt];
          if (wait !== undefined && attempt < TRANSLATE_ATTEMPTS - 1) {
            await sleep(wait);
          }
        }
      }

      // Fail open: English source content so download can continue.
      dispatch(
        translationSucceeded({
          content,
          extras: {},
          cached: false,
          provider: 'fallback-en',
          warning: `Translation unavailable (${lastMessage}). Downloading in English.`,
        }),
      );
      return content;
    },
    [content, dispatch, exportLanguage],
  );

  return { translate };
}
