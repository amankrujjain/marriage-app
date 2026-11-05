import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { getUserInvoiceLinkService } from '../../services/billing/getUserInvoiceLinkService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function getUserInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await getUserInvoiceLinkService({
      userId: req.user.id,
      orderId: String(req.params.id),
    });
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
