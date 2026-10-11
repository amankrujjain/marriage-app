import type { PublicUser } from './user';

/** Session payload after login/register/refresh — tokens live in httpOnly cookies. */
export interface AuthSessionResponse {
  user: PublicUser;
}

/** @deprecated Prefer AuthSessionResponse — accessToken is no longer returned in JSON. */
export type AuthTokensResponse = AuthSessionResponse;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleAuthPayload {
  idToken: string;
}
