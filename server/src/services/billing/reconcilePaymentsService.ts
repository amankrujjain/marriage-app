import { PREMIUM_AMOUNT_MINOR } from '@marriage/shared';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { getRazorpayClient } from '../../providers/razorpay/razorpayClient';
import { appendPaymentLog } from './paymentLogService';
import { fulfilPaymentOrder } from './fulfilPremiumService';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';
import { extractRazorpayPaymentMethod } from '../../utils/razorpayPaymentMethod';

export type ReconcileResult = {
  scanned: number;
  fulfilled: number;
  failed: number;
  skipped: number;
  errors: string[];
};

const STALE_MINUTES = 20;
const ABANDON_HOURS = 24;

export async function reconcilePendingPayments(): Promise<ReconcileResult> {
  const result: ReconcileResult = {
    scanned: 0,
    fulfilled: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    result.errors.push('Razorpay not configured');
    return result;
  }

  const staleBefore = new Date(Date.now() - STALE_MINUTES * 60 * 1000);
  const abandonBefore = new Date(Date.now() - ABANDON_HOURS * 60 * 60 * 1000);

  const pending = await PaymentOrderModel.find({
    status: 'pending',
    createdAt: { $lte: staleBefore },
    providerOrderId: { $exists: true, $ne: '' },
  }).limit(50);

  result.scanned = pending.length;
  const razorpay = getRazorpayClient();

  for (const order of pending) {
    try {
      const payments = await razorpay.orders.fetchPayments(order.providerOrderId!);
      const items = payments.items ?? [];
      const captured = items.find(
        (p) => String(p.status) === 'captured' && Number(p.amount) === order.amountMinor,
      );

      if (captured) {
        const providerPaymentId = String(captured.id);
        if (Number(captured.amount) !== PREMIUM_AMOUNT_MINOR) {
          result.skipped += 1;
          continue;
        }
        const methodInfo = extractRazorpayPaymentMethod(
          captured as unknown as Record<string, unknown>,
        );
        order.status = 'paid';
        order.paidAt = new Date();
        order.providerPaymentId = providerPaymentId;
        order.paymentMethod = methodInfo.paymentMethod;
        order.paymentMethodDetail = methodInfo.paymentMethodDetail;
        await order.save();
        await appendPaymentLog({
          orderId: order._id,
          fromStatus: 'pending',
          toStatus: 'paid',
          source: 'reconcile',
          message: 'Healed from Razorpay',
          meta: {
            providerPaymentId,
            paymentMethod: methodInfo.paymentMethod,
          },
        });
        await fulfilPaymentOrder({
          order,
          providerPaymentId,
          paymentMethod: methodInfo.paymentMethod,
          paymentMethodDetail: methodInfo.paymentMethodDetail,
          source: 'reconcile',
        });
        result.fulfilled += 1;
        continue;
      }

      if (order.createdAt <= abandonBefore) {
        await PaymentOrderModel.updateOne(
          { _id: order._id, status: 'pending' },
          {
            $set: {
              status: 'cancelled',
              cancelledAt: new Date(),
              lastError: 'Abandoned after reconcile grace period',
            },
          },
        );
        await appendPaymentLog({
          orderId: order._id,
          fromStatus: 'pending',
          toStatus: 'cancelled',
          source: 'reconcile',
          message: 'Abandoned stale pending order',
        });
        result.failed += 1;
      } else {
        result.skipped += 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'reconcile error';
      result.errors.push(`${order._id.toString()}: ${message}`);
      logger.warn('billing.reconcile.order_error', {
        orderId: order._id.toString(),
        message,
      });
    }
  }

  logger.info('billing.reconcile.done', result);
  return result;
}
