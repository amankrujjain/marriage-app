import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { BadRequestError } from '../../errors/BadRequestError';
import { checkoutWeddingPass } from '../../services/billing/checkoutService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function checkoutController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const idempotencyKey =
      req.get('idempotency-key') || req.get('Idempotency-Key') || '';
    if (!idempotencyKey) {
      throw new BadRequestError('Idempotency-Key header required', 'IDEMPOTENCY_KEY_REQUIRED');
    }
    const data = await checkoutWeddingPass({
      userId: req.user.id,
      idempotencyKey,
    });
    sendSuccess(res, data, 'Checkout order created');
  } catch (error) {
    next(error);
  }
}
