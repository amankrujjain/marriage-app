'use client';

import { useAppDispatch } from '@/store/hooks';
import type { LoginPayload, RegisterPayload } from '@marriage/shared';
import {
  authCleared,
  authFailed,
  authLoading,
  authSuccess,
} from '../store/authSlice';
import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/authApi';
import { ApiClientError } from '@/lib/apiClient';

export function useAuthActions() {
  const dispatch = useAppDispatch();

  async function register(payload: RegisterPayload): Promise<void> {
    dispatch(authLoading());
    try {
      const data = await registerRequest(payload);
      dispatch(authSuccess(data.user));
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : 'Register failed';
      dispatch(authFailed(message));
      throw error;
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    dispatch(authLoading());
    try {
      const data = await loginRequest(payload);
      dispatch(authSuccess(data.user));
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : 'Login failed';
      dispatch(authFailed(message));
      throw error;
    }
  }

  async function logout(): Promise<void> {
    await logoutRequest();
    dispatch(authCleared());
  }

  return { register, login, logout };
}
