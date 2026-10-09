import type { PublicUser } from './user';

export interface AuthTokensResponse {
  user: PublicUser;
  accessToken: string;
}

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
