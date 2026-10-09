import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isBootstrapped: boolean;
}

const initialState: UiState = {
  isBootstrapped: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    markBootstrapped(state) {
      state.isBootstrapped = true;
    },
  },
});

export const { markBootstrapped } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
