import type { Response } from 'express';
import type { ApiSuccessResponse } from '@marriage/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200,
): void {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(body);
}
