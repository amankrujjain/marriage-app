import {
  PREMIUM_AMOUNT_MINOR,
  PREMIUM_CURRENCY,
  WEDDING_PASS_PLAN_NAME,
  WEDDING_PASS_PLAN_SLUG,
  type CheckoutResponse,
} from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { getRazorpayClient, requireRazorpayKeys } from '../../providers/razorpay/razorpayClient';
import { appendPaymentLog } from './paymentLogService';
import { logger } from '../../utils/logger';

export async function checkoutWeddingPass(input: {
  userId: string;
  idempotencyKey: string;
}): Promise<CheckoutResponse> {
  const key = input.idempotencyKey.trim();
  if (!key || key.length < 8 || key.length > 128) {
    throw new BadRequestError('Idempotency-Key required', 'IDEMPOTENCY_KEY_REQUIRED');
  }

  const { keyId } = requireRazorpayKeys();

  const existing = await PaymentOrderModel.findOne({
    userId: input.userId,
    idempotencyKey: key,
  });

  if (existing?.providerOrderId && ['pending', 'paid', 'fulfilled'].includes(existing.status)) {
    return {
      orderId: existing._id.toString(),
      providerOrderId: existing.providerOrderId,
      amountMinor: existing.amountMinor,
      currency: existing.currency,
      keyId,
      planSlug: existing.planSlug,
      planName: WEDDING_PASS_PLAN_NAME,
    };
  }

  const razorpay = getRazorpayClient();
  const providerOrder = await razorpay.orders.create({
    amount: PREMIUM_AMOUNT_MINOR,
    currency: PREMIUM_CURRENCY,
    receipt: `wp_${input.userId.slice(-8)}_${Date.now().toString(36)}`.slice(0, 40),
    notes: {
      userId: input.userId,
      planSlug: WEDDING_PASS_PLAN_SLUG,
      idempotencyKey: key,
    },
  });

  const providerOrderId = String(providerOrder.id);

  let order = existing;
  if (order) {
    order.status = 'pending';
    order.providerOrderId = providerOrderId;
    order.amountMinor = PREMIUM_AMOUNT_MINOR;
    order.currency = PREMIUM_CURRENCY;
    order.planSlug = WEDDING_PASS_PLAN_SLUG;
    order.lastError = null;
    await order.save();
  } else {
    try {
      order = await PaymentOrderModel.create({
        userId: input.userId,
        planSlug: WEDDING_PASS_PLAN_SLUG,
        amountMinor: PREMIUM_AMOUNT_MINOR,
        currency: PREMIUM_CURRENCY,
        status: 'pending',
        idempotencyKey: key,
        providerOrderId,
      });
    } catch (err: unknown) {
      // Race: another request created the same idempotency key
      const raced = await PaymentOrderModel.findOne({
        userId: input.userId,
        idempotencyKey: key,
      });
      if (raced?.providerOrderId) {
        return {
          orderId: raced._id.toString(),
          providerOrderId: raced.providerOrderId,
          amountMinor: raced.amountMinor,
          currency: raced.currency,
          keyId,
          planSlug: raced.planSlug,
          planName: WEDDING_PASS_PLAN_NAME,
        };
      }
      throw err;
    }
  }

  await appendPaymentLog({
    orderId: order._id,
    fromStatus: existing?.status ?? 'created',
    toStatus: 'pending',
    source: 'server',
    message: 'Razorpay order created',
    meta: { providerOrderId },
  });

  logger.info('billing.checkout.created', {
    orderId: order._id.toString(),
    userId: input.userId,
    providerOrderId,
  });

  return {
    orderId: order._id.toString(),
    providerOrderId,
    amountMinor: PREMIUM_AMOUNT_MINOR,
    currency: PREMIUM_CURRENCY,
    keyId,
    planSlug: WEDDING_PASS_PLAN_SLUG,
    planName: WEDDING_PASS_PLAN_NAME,
  };
}
