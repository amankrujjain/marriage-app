import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/sendSuccess';

/** Stateless JWT logout — client discards the token. */
export function logoutController(_req: Request, res: Response): void {
  sendSuccess(res, null, 'Logged out successfully');
}
