import type { Response } from 'express';
import type { ApiErrorResponse } from '@marriage/shared';
import multer from 'multer';

export function tryHandleMulterError(err: unknown, res: Response): boolean {
  if (!(err instanceof multer.MulterError)) {
    return false;
  }

  const message =
    err.code === 'LIMIT_FILE_SIZE' ? 'Photo must be under 2MB' : err.message;

  res.status(400).json({
    success: false,
    message,
    error: { code: 'UPLOAD_ERROR' },
  } satisfies ApiErrorResponse);
  return true;
}
