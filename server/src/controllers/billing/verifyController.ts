import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { verifyRazorpayPayment } from '../../services/billing/verifyPaymentService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function verifyPaymentController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const { providerOrderId, providerPaymentId, signature } = req.body as {
      providerOrderId: string;
      providerPaymentId: string;
      signature: string;
    };
    const data = await verifyRazorpayPayment({
      userId: req.user.id,
      providerOrderId,
      providerPaymentId,
      signature,
    });
    sendSuccess(res, data, 'Payment verified');
  } catch (error) {
    next(error);
  }
}
