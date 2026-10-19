import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { env } from '../config/env';

/** Protect cron-only HTTP endpoints with a shared secret header. */
export function cronSecretAuth(req: Request, _res: Response, next: NextFunction): void {
  const secret = env.CRON_SECRET;
  if (!secret) {
    next(new UnauthorizedError('CRON_SECRET is not configured', 'CRON_SECRET_MISSING'));
    return;
  }
  const provided = req.get('x-cron-secret');
  if (!provided || provided !== secret) {
    next(new UnauthorizedError('Invalid cron secret', 'CRON_UNAUTHORIZED'));
    return;
  }
  next();
}
