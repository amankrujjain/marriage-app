import type { AuthSessionResponse } from '@marriage/shared';
import type { Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import {
  findValidRefreshToken,
  revokeRefreshToken,
} from '../../repositories/refreshTokenRepository';
import { findUserById } from '../../repositories/userRepository';
import { hashToken, verifyRefreshToken } from '../tokenService';
import { clearAuthCookies } from '../../utils/authCookies';
import { issueAuthSession } from './issueAuthSession';

export async function refreshAuthSession(
  rawRefreshToken: string | null,
  res: Response,
): Promise<AuthSessionResponse> {
  if (!rawRefreshToken) {
    clearAuthCookies(res);
    throw new UnauthorizedError('Refresh token required', 'REFRESH_REQUIRED');
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch (error) {
    clearAuthCookies(res);
    throw error;
  }

  const tokenHash = hashToken(rawRefreshToken);
  const stored = await findValidRefreshToken(tokenHash);
  if (!stored) {
    clearAuthCookies(res);
    throw new UnauthorizedError('Refresh token revoked or unknown', 'INVALID_REFRESH');
  }

  // Rotate: revoke current refresh before issuing a new pair
  await revokeRefreshToken(tokenHash);

  const user = await findUserById(payload.sub);
  if (!user) {
    clearAuthCookies(res);
    throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
  }

  return issueAuthSession(user, res);
}
