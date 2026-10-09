import type { NextFunction, Request, Response } from 'express';
import type { ApiErrorResponse } from '@marriage/shared';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { tryHandleMongoError } from './mongoErrorResponse';
import { tryHandleMulterError } from './multerErrorResponse';

function isJoiError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'isJoi' in err &&
    (err as { isJoi?: boolean }).isJoi === true
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ApiErrorResponse = {
      success: false,
      message: err.message,
      error: { code: err.code, ...(err.details ? { details: err.details } : {}) },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (isJoiError(err)) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: { code: 'VALIDATION_ERROR' },
    } satisfies ApiErrorResponse);
    return;
  }

  if (tryHandleMulterError(err, res) || tryHandleMongoError(err, res)) {
    return;
  }

  logger.error('Unhandled error', {
    message: err instanceof Error ? err.message : 'Unknown',
  });

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'production' ? 'Internal server error' : 'Unexpected error',
    error: { code: 'INTERNAL_ERROR' },
  } satisfies ApiErrorResponse);
}
