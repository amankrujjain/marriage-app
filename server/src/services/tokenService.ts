import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { AuthProvider, UserRole } from '@marriage/shared';
import { authConfig } from '../config/authEnv';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export type TokenKind = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  typ: TokenKind;
  /** Refresh token id (jti) — present on refresh tokens only */
  jti?: string;
}

export function signAccessToken(
  payload: Omit<JwtPayload, 'typ' | 'jti'>,
): string {
  const body: JwtPayload = { ...payload, typ: 'access' };
  return jwt.sign(body, authConfig.jwtSecret, {
    expiresIn: authConfig.accessExpiresIn,
  } as jwt.SignOptions);
}

export function signRefreshToken(
  payload: Omit<JwtPayload, 'typ'> & { jti: string },
): string {
  const body: JwtPayload = { ...payload, typ: 'refresh' };
  return jwt.sign(body, authConfig.jwtSecret, {
    expiresIn: authConfig.refreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
    if (payload.typ !== 'access') {
      throw new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN');
    }
    return payload;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN');
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
    if (payload.typ !== 'refresh' || !payload.jti) {
      throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH');
    }
    return payload;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH');
  }
}

export function createRefreshTokenId(): string {
  return crypto.randomUUID();
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshExpiryDate(): Date {
  const match = /^(\d+)([smhd])$/i.exec(authConfig.refreshExpiresIn.trim());
  const n = match ? Number(match[1]) : 7;
  const unit = match?.[2]?.toLowerCase() ?? 'd';
  const ms =
    unit === 's'
      ? n * 1000
      : unit === 'm'
        ? n * 60_000
        : unit === 'h'
          ? n * 3_600_000
          : n * 86_400_000;
  return new Date(Date.now() + ms);
}
