import Razorpay from 'razorpay';
import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '../../config/env';
import { BadRequestError } from '../../errors/BadRequestError';

let client: Razorpay | null = null;

export function requireRazorpayKeys(): { keyId: string; keySecret: string } {
  const keyId = env.RAZORPAY_KEY_ID?.trim();
  const keySecret = env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    throw new BadRequestError(
      'Payments are not configured',
      'RAZORPAY_NOT_CONFIGURED',
    );
  }
  return { keyId, keySecret };
}

export function getRazorpayClient(): Razorpay {
  if (client) return client;
  const { keyId, keySecret } = requireRazorpayKeys();
  client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return client;
}

export function verifyCheckoutSignature(input: {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = requireRazorpayKeys();
  const body = `${input.providerOrderId}|${input.providerPaymentId}`;
  const expected = createHmac('sha256', keySecret).update(body).digest('hex');
  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(input.signature, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  const secret = env.RAZORPAY_WEBHOOK_SECRET?.trim() || env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret || !signature) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
