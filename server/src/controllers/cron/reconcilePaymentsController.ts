import type { NextFunction, Request, Response } from 'express';
import { reconcilePendingPayments } from '../../services/billing/reconcilePaymentsService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function reconcilePaymentsController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await reconcilePendingPayments();
    sendSuccess(res, result, 'Payment reconciliation completed');
  } catch (error) {
    next(error);
  }
}
