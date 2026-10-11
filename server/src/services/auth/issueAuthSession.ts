import type { AuthSessionResponse } from '@marriage/shared';
import type { Response } from 'express';
import type { UserDocument } from '../../models/User';
import { setAuthCookies } from '../../utils/authCookies';
import { toPublicUser } from '../../utils/toPublicUser';
import {
  createRefreshTokenId,
  hashToken,
  refreshExpiryDate,
  signAccessToken,
  signRefreshToken,
} from '../tokenService';
import { storeRefreshToken } from '../../repositories/refreshTokenRepository';

export async function issueAuthSession(
  user: UserDocument,
  res: Response,
): Promise<AuthSessionResponse> {
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
  });

  const jti = createRefreshTokenId();
  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    jti,
  });

  await storeRefreshToken({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiryDate(),
  });

  setAuthCookies(res, { accessToken, refreshToken });

  return { user: toPublicUser(user) };
}
