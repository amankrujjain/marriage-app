import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { verifyAccessToken } from '../services/tokenService';

function extractBearer(header?: string): string | null {
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractBearer(req.headers.authorization);
    if (!token) {
      throw new UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
    }
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      authProvider: payload.authProvider,
    };
    next();
  } catch (error) {
    next(error);
  }
}
