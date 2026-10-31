import type { NextFunction, Request, Response } from 'express';
import { requestPasswordReset } from '../../services/auth/forgotPasswordService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function forgotPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await requestPasswordReset(req.body);
    sendSuccess(
      res,
      null,
      'If an account exists for that email, you will receive reset instructions shortly.',
    );
  } catch (error) {
    next(error);
  }
}
