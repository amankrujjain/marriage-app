import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  LanguageCode,
  type BiodataContent,
  type StructuredFields,
} from '@marriage/shared';

export type TranslationStatus = 'idle' | 'loading' | 'ready' | 'error';

interface LanguageState {
  exportLanguage: LanguageCode;
  translatedContent: BiodataContent | null;
  /** Translated unsynced editor fields keyed as editor.{sectionId}.{fieldId} */
  translatedExtras: StructuredFields | null;
  status: TranslationStatus;
  error: string | null;
  cached: boolean;
  provider: string | null;
}

const initialState: LanguageState = {
  exportLanguage: LanguageCode.EN,
  translatedContent: null,
  translatedExtras: null,
  status: 'idle',
  error: null,
  cached: false,
  provider: null,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setExportLanguage(state, action: PayloadAction<LanguageCode>) {
      state.exportLanguage = action.payload;
      state.translatedContent = null;
      state.translatedExtras = null;
      state.status = 'idle';
      state.error = null;
      state.cached = false;
      state.provider = null;
    },
    translationStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    translationSucceeded(
      state,
      action: PayloadAction<{
        content: BiodataContent;
        extras?: StructuredFields;
        cached: boolean;
        provider: string;
        /** Soft warning (e.g. English fallback); does not block export. */
        warning?: string;
      }>,
    ) {
      state.translatedContent = action.payload.content;
      state.translatedExtras = action.payload.extras ?? {};
      state.cached = action.payload.cached;
      state.provider = action.payload.provider;
      state.status = 'ready';
      state.error = action.payload.warning ?? null;
    },
    translationFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    clearTranslation(state) {
      state.translatedContent = null;
      state.translatedExtras = null;
      state.status = 'idle';
      state.error = null;
      state.cached = false;
      state.provider = null;
    },
  },
});

export const {
  setExportLanguage,
  translationStarted,
  translationSucceeded,
  translationFailed,
  clearTranslation,
} = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
