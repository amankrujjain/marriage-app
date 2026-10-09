import { combineReducers } from '@reduxjs/toolkit';
import { uiReducer } from './slices/uiSlice';
import { authReducer } from '@/features/auth/store/authSlice';
import { biodataReducer } from '@/features/biodata/store/biodataSlice';
import { templateReducer } from '@/features/templates/store/templateSlice';
import { languageReducer } from '@/features/translation/store/languageSlice';
import { exportReducer } from '@/features/export/store/exportSlice';

export const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  biodata: biodataReducer,
  template: templateReducer,
  language: languageReducer,
  export: exportReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
