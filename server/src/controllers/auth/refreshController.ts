import type { NextFunction, Request, Response } from 'express';
import { refreshAuthSession } from '../../services/auth/refreshSessionService';
import { readRefreshTokenFromRequest } from '../../utils/authCookies';
import { sendSuccess } from '../../utils/sendSuccess';

export async function refreshController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await refreshAuthSession(readRefreshTokenFromRequest(req), res);
    sendSuccess(res, data, 'Session refreshed');
  } catch (error) {
    next(error);
  }
}
