import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { verifyAccessToken } from '../services/tokenService';
import { readAccessTokenFromRequest } from '../utils/authCookies';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = readAccessTokenFromRequest(req);
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
