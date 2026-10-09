import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { getCurrentUser } from '../../services/auth/meService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function meController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const data = await getCurrentUser(req.user.id);
    sendSuccess(res, data, 'Current user fetched');
  } catch (error) {
    next(error);
  }
}
