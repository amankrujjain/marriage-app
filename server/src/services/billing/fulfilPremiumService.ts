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
import { sendPurchaseAdminEmail } from '../email/sendPurchaseAdminEmail';
import { sendPurchaseInvoiceEmail } from '../email/sendPurchaseInvoiceEmail';
import { issueInvoiceForOrder } from './issueInvoiceForOrder';

export function nextPremiumUntil(current: Date | null | undefined): Date {
  const now = Date.now();
  const base =
    current && isPremium(current) ? current.getTime() : now;
  return new Date(base + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

/** If a fulfilled order exists but premium was never saved (crash mid-fulfil), grant once. */
export async function healPremiumIfMissing(userId: string): Promise<void> {
  const user = await UserModel.findById(userId);
  if (!user) return;
  if (isPremium(user.premiumUntil)) return;

  const hasFulfilled = await PaymentOrderModel.exists({
    userId: user._id,
    status: 'fulfilled',
  });
  if (!hasFulfilled) return;

  user.premiumUntil = nextPremiumUntil(user.premiumUntil);
  await user.save();
  logger.warn('billing.fulfil.premium_healed', {
    userId: user._id.toString(),
    premiumUntil: user.premiumUntil?.toISOString(),
  });
}

async function notifyPurchaseAsync(
  claimed: PaymentOrderDocument,
  user: { name: string; email: string; phone?: string | null },
): Promise<void> {
  try {
    await sendPurchaseAdminEmail({
      user: { name: user.name, email: user.email, phone: user.phone },
      order: {
        id: claimed._id.toString(),
        planSlug: claimed.planSlug,
        amountMinor: claimed.amountMinor,
        currency: claimed.currency,
        providerOrderId: claimed.providerOrderId,
        providerPaymentId: claimed.providerPaymentId,
        paymentMethod: claimed.paymentMethod,
        paymentMethodDetail: claimed.paymentMethodDetail,
        paidAt: claimed.paidAt,
        fulfilledAt: claimed.fulfilledAt,
      },
    });
  } catch (error) {
    logger.error('billing.fulfil.admin_email_failed', {
      orderId: claimed._id.toString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const invoice = await issueInvoiceForOrder({
      order: claimed,
      user: { name: user.name, email: user.email, phone: user.phone },
    });
    await sendPurchaseInvoiceEmail({
      to: user.email,
      invoiceNumber: invoice.invoiceNumber,
      planSlug: claimed.planSlug,
      amountMinor: claimed.amountMinor,
      currency: claimed.currency,
      downloadUrl: invoice.downloadUrl,
    });
  } catch (error) {
    logger.error('billing.fulfil.invoice_failed', {
      orderId: claimed._id.toString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Idempotent fulfilment: claim pending/paid → fulfilled, then grant/extend Wedding Pass.
 * Emails/invoice run after premium is saved so verify can return the updated user quickly.
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
    await healPremiumIfMissing(order.userId.toString());
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
    if (latest?.status === 'fulfilled') {
      await healPremiumIfMissing(latest.userId.toString());
      return latest;
    }
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

  // Do not block payment verify on SMTP / PDF — client needs isPremium immediately.
  void notifyPurchaseAsync(claimed, {
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  return claimed;
}
