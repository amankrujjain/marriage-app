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

  // Provider webhooks have no browser Origin; signature is verified separately.
  if (req.path.includes('/billing/webhooks/')) {
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

  // Non-browser clients (no Origin/Referer) — allow; cookie CSRF requires a browser.
  next();
}
