import type { NextFunction, Request, Response } from 'express';
import { loginUser } from '../../services/auth/loginService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await loginUser(req.body);
    sendSuccess(res, data, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
}
