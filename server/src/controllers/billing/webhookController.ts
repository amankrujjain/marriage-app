import type { NextFunction, Request, Response } from 'express';
import { handleRazorpayWebhook } from '../../services/billing/webhookService';

export async function razorpayWebhookController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === 'string' ? req.body : '', 'utf8');
    const signature = req.get('x-razorpay-signature') ?? undefined;
    const result = await handleRazorpayWebhook({ rawBody, signature });
    res.status(result.ok ? 200 : 400).json({ success: result.ok, result: result.result });
  } catch (error) {
    next(error);
  }
}
