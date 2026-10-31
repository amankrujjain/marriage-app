import type { NextFunction, Request, Response } from 'express';
import { resetPasswordWithToken } from '../../services/auth/resetPasswordService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await resetPasswordWithToken(req.body);
    sendSuccess(res, null, 'Password updated. You can sign in with your new password.');
  } catch (error) {
    next(error);
  }
}
