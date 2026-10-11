import type { NextFunction, Request, Response } from 'express';
import { registerUser } from '../../services/auth/registerService';
import { issueAuthSession } from '../../services/auth/issueAuthSession';
import { sendCreated } from '../../utils/sendCreated';

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await registerUser(req.body);
    const data = await issueAuthSession(user, res);
    sendCreated(res, data, 'Registered successfully');
  } catch (error) {
    next(error);
  }
}
