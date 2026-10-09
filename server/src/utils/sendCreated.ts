import type { Response } from 'express';
import { sendSuccess } from './sendSuccess';

export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created successfully',
): void {
  sendSuccess(res, data, message, 201);
}
