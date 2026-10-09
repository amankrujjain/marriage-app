import jwt from 'jsonwebtoken';
import type { AuthProvider, UserRole } from '@marriage/shared';
import { authConfig } from '../config/authEnv';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN');
  }
}
