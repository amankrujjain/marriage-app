import type { NextFunction, Request, Response } from 'express';
import {
  PREMIUM_AMOUNT_INR,
  PREMIUM_AMOUNT_MINOR,
  PREMIUM_CURRENCY,
  PREMIUM_DURATION_DAYS,
  WEDDING_PASS_PLAN_NAME,
  WEDDING_PASS_PLAN_SLUG,
} from '@marriage/shared';
import { sendSuccess } from '../../utils/sendSuccess';

export function listPlansController(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    sendSuccess(res, [
      {
        slug: WEDDING_PASS_PLAN_SLUG,
        name: WEDDING_PASS_PLAN_NAME,
        description: 'All premium designs, unlimited PDF downloads for 30 days.',
        amountMinor: PREMIUM_AMOUNT_MINOR,
        amountInr: PREMIUM_AMOUNT_INR,
        currency: PREMIUM_CURRENCY,
        durationDays: PREMIUM_DURATION_DAYS,
      },
    ]);
  } catch (error) {
    next(error);
  }
}
