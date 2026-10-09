'use client';

import { LanguageCode } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { translateBiodata } from '../services/translationApi';
import {
  translationFailed,
  translationStarted,
  translationSucceeded,
} from '../store/languageSlice';

export function useTranslateBiodata() {
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.biodata.content);
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);

  async function translate(): Promise<boolean> {
    if (exportLanguage === LanguageCode.EN) {
      dispatch(
        translationSucceeded({
          content,
          cached: false,
          provider: 'passthrough',
        }),
      );
      return true;
    }

    dispatch(translationStarted());
    try {
      const result = await translateBiodata({
        content,
        targetLanguage: exportLanguage,
      });
      dispatch(
        translationSucceeded({
          content: result.content,
          cached: result.cached,
          provider: result.provider,
        }),
      );
      return true;
    } catch (error) {
      const message =
        error instanceof ApiClientError || error instanceof Error
          ? error.message
          : 'Translation failed';
      dispatch(translationFailed(message));
      return false;
    }
  }

  return { translate };
}
