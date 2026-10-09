import type { NextFunction, Request, Response } from 'express';
import { loginWithGoogle } from '../../services/auth/googleAuthService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function googleController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await loginWithGoogle(req.body.idToken as string);
    sendSuccess(res, data, 'Logged in with Google');
  } catch (error) {
    next(error);
  }
}
