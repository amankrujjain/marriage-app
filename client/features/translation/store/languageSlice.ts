import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LanguageCode, type BiodataContent } from '@marriage/shared';

export type TranslationStatus = 'idle' | 'loading' | 'ready' | 'error';

interface LanguageState {
  exportLanguage: LanguageCode;
  translatedContent: BiodataContent | null;
  status: TranslationStatus;
  error: string | null;
  cached: boolean;
  provider: string | null;
}

const initialState: LanguageState = {
  exportLanguage: LanguageCode.EN,
  translatedContent: null,
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
        cached: boolean;
        provider: string;
      }>,
    ) {
      state.translatedContent = action.payload.content;
      state.cached = action.payload.cached;
      state.provider = action.payload.provider;
      state.status = 'ready';
    },
    translationFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    clearTranslation(state) {
      state.translatedContent = null;
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
