import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PublicUser } from '@marriage/shared';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

interface AuthState {
  user: PublicUser | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<PublicUser>) {
      state.user = action.payload;
      state.status = 'authenticated';
      state.error = null;
    },
    authAnonymous(state) {
      state.user = null;
      state.status = 'anonymous';
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = state.user ? 'authenticated' : 'anonymous';
    },
    authCleared(state) {
      state.user = null;
      state.status = 'anonymous';
      state.error = null;
    },
  },
});

export const { authLoading, authSuccess, authAnonymous, authFailed, authCleared } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
