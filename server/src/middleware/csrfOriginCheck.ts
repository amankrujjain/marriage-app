import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { ForbiddenError } from '../errors/ForbiddenError';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Mitigate CSRF for cookie-authenticated cross-site requests (SameSite=None).
 * Browser mutating requests must carry an Origin/Referer matching CLIENT_URL.
 */
export function csrfOriginCheck(req: Request, _res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  // Provider webhooks / internal cron have no browser Origin; auth is separate.
  if (
    req.path.includes('/billing/webhooks/') ||
    req.path.includes('/cron/')
  ) {
    next();
    return;
  }

  const origin = req.get('origin');
  const referer = req.get('referer');
  const allowed = env.CLIENT_URL.replace(/\/$/, '');

  if (origin) {
    if (origin.replace(/\/$/, '') === allowed) {
      next();
      return;
    }
    next(new ForbiddenError('Invalid request origin', 'CSRF_ORIGIN'));
    return;
  }

  if (referer) {
    try {
      const ref = new URL(referer);
      if (`${ref.protocol}//${ref.host}` === allowed) {
        next();
        return;
      }
    } catch {
      /* fall through */
    }
    next(new ForbiddenError('Invalid request origin', 'CSRF_ORIGIN'));
    return;
  }

  // Cookie sessions use SameSite=None — require Origin or Referer on mutations.
  // (Previously allowed missing both, which let stolen-cookie clients skip CSRF.)
  next(new ForbiddenError('Missing request origin', 'CSRF_ORIGIN'));
}
