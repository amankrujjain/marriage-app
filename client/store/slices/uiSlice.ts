import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isBootstrapped: boolean;
  globalLoading: boolean;
  globalLoadingMessage: string | null;
}

const initialState: UiState = {
  isBootstrapped: true,
  globalLoading: false,
  globalLoadingMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    markBootstrapped(state) {
      state.isBootstrapped = true;
    },
    globalLoadingShow(state, action: PayloadAction<string | undefined>) {
      state.globalLoading = true;
      state.globalLoadingMessage = action.payload ?? null;
    },
    globalLoadingHide(state) {
      state.globalLoading = false;
      state.globalLoadingMessage = null;
    },
  },
});

export const { markBootstrapped, globalLoadingShow, globalLoadingHide } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
