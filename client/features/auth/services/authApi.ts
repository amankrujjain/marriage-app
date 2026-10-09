import type {
  AuthTokensResponse,
  GoogleAuthPayload,
  LoginPayload,
  PublicUser,
  RegisterPayload,
} from '@marriage/shared';
import { apiGet, apiPost } from '@/lib/apiClient';
import { clearAccessToken, setAccessToken } from '@/lib/tokenStorage';

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthTokensResponse> {
  const data = await apiPost<AuthTokensResponse>('/auth/register', payload);
  setAccessToken(data.accessToken);
  return data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthTokensResponse> {
  const data = await apiPost<AuthTokensResponse>('/auth/login', payload);
  setAccessToken(data.accessToken);
  return data;
}

export async function googleAuthRequest(
  payload: GoogleAuthPayload,
): Promise<AuthTokensResponse> {
  const data = await apiPost<AuthTokensResponse>('/auth/google', payload);
  setAccessToken(data.accessToken);
  return data;
}

export async function fetchMe(): Promise<PublicUser> {
  return apiGet<PublicUser>('/auth/me');
}

export async function logoutRequest(): Promise<void> {
  try {
    await apiPost<null>('/auth/logout');
  } finally {
    clearAccessToken();
  }
}
