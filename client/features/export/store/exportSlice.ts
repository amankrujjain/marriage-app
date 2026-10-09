import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ExportResult } from '@marriage/shared';

export type ExportStatus = 'idle' | 'capturing' | 'exporting' | 'ready' | 'error';

interface ExportState {
  status: ExportStatus;
  result: ExportResult | null;
  error: string | null;
}

const initialState: ExportState = {
  status: 'idle',
  result: null,
  error: null,
};

const exportSlice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    exportCapturing(state) {
      state.status = 'capturing';
      state.error = null;
    },
    exportUploading(state) {
      state.status = 'exporting';
    },
    exportSucceeded(state, action: PayloadAction<ExportResult>) {
      state.status = 'ready';
      state.result = action.payload;
    },
    exportFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    exportReset(state) {
      state.status = 'idle';
      state.result = null;
      state.error = null;
    },
  },
});

export const {
  exportCapturing,
  exportUploading,
  exportSucceeded,
  exportFailed,
  exportReset,
} = exportSlice.actions;
export const exportReducer = exportSlice.reducer;
