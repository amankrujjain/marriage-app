import type { Response } from 'express';
import type { ApiErrorResponse } from '@marriage/shared';

export function tryHandleMongoError(err: unknown, res: Response): boolean {
  if (typeof err !== 'object' || err === null || !('name' in err)) {
    return false;
  }

  const mongoErr = err as { name: string; code?: number };

  if (mongoErr.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid identifier',
      error: { code: 'INVALID_ID' },
    } satisfies ApiErrorResponse);
    return true;
  }

  if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Resource already exists',
      error: { code: 'DUPLICATE_KEY' },
    } satisfies ApiErrorResponse);
    return true;
  }

  return false;
}
