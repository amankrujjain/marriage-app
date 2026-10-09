import type { NextFunction, Request, Response } from 'express';
import { registerUser } from '../../services/auth/registerService';
import { sendCreated } from '../../utils/sendCreated';

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await registerUser(req.body);
    sendCreated(res, data, 'Registered successfully');
  } catch (error) {
    next(error);
  }
}
