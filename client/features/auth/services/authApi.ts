import type {
  AuthSessionResponse,
  GoogleAuthPayload,
  LoginPayload,
  PublicUser,
  RegisterPayload,
} from '@marriage/shared';
import { apiGet, apiPost } from '@/lib/apiClient';
import { clearLegacyAccessToken } from '@/lib/tokenStorage';

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthSessionResponse> {
  clearLegacyAccessToken();
  return apiPost<AuthSessionResponse>('/auth/register', payload);
}

export async function loginRequest(payload: LoginPayload): Promise<AuthSessionResponse> {
  clearLegacyAccessToken();
  return apiPost<AuthSessionResponse>('/auth/login', payload);
}

export async function googleAuthRequest(
  payload: GoogleAuthPayload,
): Promise<AuthSessionResponse> {
  clearLegacyAccessToken();
  return apiPost<AuthSessionResponse>('/auth/google', payload);
}

export async function refreshSessionRequest(): Promise<AuthSessionResponse> {
  return apiPost<AuthSessionResponse>('/auth/refresh');
}

export async function fetchMe(): Promise<PublicUser> {
  return apiGet<PublicUser>('/auth/me');
}

export async function logoutRequest(): Promise<void> {
  try {
    await apiPost<null>('/auth/logout');
  } finally {
    clearLegacyAccessToken();
  }
}
