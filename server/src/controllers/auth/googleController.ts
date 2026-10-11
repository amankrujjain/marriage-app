import type { NextFunction, Request, Response } from 'express';
import { loginWithGoogle } from '../../services/auth/googleAuthService';
import { issueAuthSession } from '../../services/auth/issueAuthSession';
import { sendSuccess } from '../../utils/sendSuccess';

export async function googleController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await loginWithGoogle(req.body.idToken as string);
    const data = await issueAuthSession(user, res);
    sendSuccess(res, data, 'Logged in with Google');
  } catch (error) {
    next(error);
  }
}
