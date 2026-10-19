import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { NotFoundError } from '../../errors/NotFoundError';
import { WEDDING_PASS_PLAN_SLUG } from '@marriage/shared';
import { findUserById } from '../../repositories/userRepository';
import { isPremium } from '../../utils/isPremium';
import { sendSuccess } from '../../utils/sendSuccess';

export async function billingMeController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const user = await findUserById(req.user.id);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    const premium = isPremium(user.premiumUntil);
    sendSuccess(res, {
      isPremium: premium,
      premiumUntil: user.premiumUntil ? user.premiumUntil.toISOString() : null,
      planSlug: premium ? WEDDING_PASS_PLAN_SLUG : null,
    });
  } catch (error) {
    next(error);
  }
}
