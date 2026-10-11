import type { NextFunction, Request, Response } from 'express';
import { loginUser } from '../../services/auth/loginService';
import { issueAuthSession } from '../../services/auth/issueAuthSession';
import { sendSuccess } from '../../utils/sendSuccess';

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await loginUser(req.body);
    const data = await issueAuthSession(user, res);
    sendSuccess(res, data, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
}
