import type { NextFunction, Request, Response } from 'express';
import {
  hashToken,
  verifyRefreshToken,
} from '../../services/tokenService';
import {
  revokeAllRefreshTokensForUser,
  revokeRefreshToken,
} from '../../repositories/refreshTokenRepository';
import {
  clearAuthCookies,
  readRefreshTokenFromRequest,
} from '../../utils/authCookies';
import { sendSuccess } from '../../utils/sendSuccess';

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const raw = readRefreshTokenFromRequest(req);
    if (raw) {
      try {
        const payload = verifyRefreshToken(raw);
        await revokeRefreshToken(hashToken(raw));
        await revokeAllRefreshTokensForUser(payload.sub);
      } catch {
        /* ignore invalid refresh on logout */
      }
    }
    clearAuthCookies(res);
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}
