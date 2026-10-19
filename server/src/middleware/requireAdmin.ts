import type { NextFunction, Request, Response } from 'express';
import { UserRole } from '@marriage/shared';
import { ForbiddenError } from '../errors/ForbiddenError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { findUserById } from '../repositories/userRepository';

/** Re-reads role from DB so promote/demote takes effect without waiting for token expiry. */
export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const user = await findUserById(req.user.id);
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Admin access required', 'ADMIN_REQUIRED');
    }
    req.user.role = UserRole.ADMIN;
    next();
  } catch (error) {
    next(error);
  }
}
