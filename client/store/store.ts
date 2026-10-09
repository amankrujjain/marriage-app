import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type { RootState } from './rootReducer';
