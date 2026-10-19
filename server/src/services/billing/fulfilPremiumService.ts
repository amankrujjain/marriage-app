import {
  PREMIUM_DURATION_DAYS,
  type PaymentOrderStatus,
} from '@marriage/shared';
import { PaymentOrderModel, type PaymentOrderDocument } from '../../models/PaymentOrder';
import { UserModel } from '../../models/User';
import { isPremium } from '../../utils/isPremium';
import { appendPaymentLog } from './paymentLogService';
import type { PaymentLogSource } from '../../models/PaymentLog';
import { logger } from '../../utils/logger';

function nextPremiumUntil(current: Date | null | undefined): Date {
  const now = Date.now();
  const base =
    current && isPremium(current) ? current.getTime() : now;
  return new Date(base + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Idempotent fulfilment: claim pending/paid → fulfilled, then grant/extend Wedding Pass.
 */
export async function fulfilPaymentOrder(input: {
  order: PaymentOrderDocument;
  providerPaymentId?: string;
  paymentMethod?: string | null;
  paymentMethodDetail?: string | null;
  source: PaymentLogSource;
}): Promise<PaymentOrderDocument> {
  const { order, providerPaymentId, paymentMethod, paymentMethodDetail, source } =
    input;

  if (order.status === 'fulfilled') {
    if (
      (paymentMethod || paymentMethodDetail) &&
      (!order.paymentMethod || !order.paymentMethodDetail)
    ) {
      await PaymentOrderModel.updateOne(
        { _id: order._id },
        {
          $set: {
            ...(paymentMethod ? { paymentMethod } : {}),
            ...(paymentMethodDetail ? { paymentMethodDetail } : {}),
          },
        },
      );
      if (paymentMethod) order.paymentMethod = paymentMethod;
      if (paymentMethodDetail) order.paymentMethodDetail = paymentMethodDetail;
    }
    return order;
  }

  const allowedFrom: PaymentOrderStatus[] = ['pending', 'paid'];
  const claimed = await PaymentOrderModel.findOneAndUpdate(
    { _id: order._id, status: { $in: allowedFrom } },
    {
      $set: {
        status: 'fulfilled',
        fulfilledAt: new Date(),
        paidAt: order.paidAt ?? new Date(),
        ...(providerPaymentId ? { providerPaymentId } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
        ...(paymentMethodDetail ? { paymentMethodDetail } : {}),
      },
    },
    { new: true },
  );

  if (!claimed) {
    const latest = await PaymentOrderModel.findById(order._id);
    if (latest?.status === 'fulfilled') return latest;
    throw new Error(`Cannot fulfil order in status ${order.status}`);
  }

  await appendPaymentLog({
    orderId: claimed._id,
    fromStatus: order.status,
    toStatus: 'fulfilled',
    source,
    message: 'Order fulfilled',
    meta: providerPaymentId ? { providerPaymentId } : undefined,
  });

  const user = await UserModel.findById(claimed.userId);
  if (!user) {
    logger.error('billing.fulfil.user_missing', { orderId: claimed._id.toString() });
    return claimed;
  }

  user.premiumUntil = nextPremiumUntil(user.premiumUntil);
  await user.save();

  logger.info('billing.fulfil.ok', {
    orderId: claimed._id.toString(),
    userId: user._id.toString(),
    premiumUntil: user.premiumUntil?.toISOString(),
    source,
  });

  return claimed;
}
