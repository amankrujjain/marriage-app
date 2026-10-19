import { PREMIUM_AMOUNT_MINOR } from '@marriage/shared';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { PaymentWebhookLogModel } from '../../models/PaymentWebhookLog';
import { verifyWebhookSignature } from '../../providers/razorpay/razorpayClient';
import { appendPaymentLog } from './paymentLogService';
import { fulfilPaymentOrder } from './fulfilPremiumService';
import { logger } from '../../utils/logger';
import { extractRazorpayPaymentMethod } from '../../utils/razorpayPaymentMethod';

type RazorpayWebhookPayload = {
  event?: string;
  id?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        status?: string;
        method?: string;
        vpa?: string;
        bank?: string;
        wallet?: string;
        card?: {
          network?: string;
          type?: string;
          last4?: string;
        };
        upi?: { vpa?: string };
      };
    };
  };
};

export async function handleRazorpayWebhook(input: {
  rawBody: Buffer;
  signature: string | undefined;
}): Promise<{ ok: boolean; result: string }> {
  const signatureValid = verifyWebhookSignature(
    input.rawBody,
    input.signature ?? '',
  );

  let parsed: RazorpayWebhookPayload;
  try {
    parsed = JSON.parse(input.rawBody.toString('utf8')) as RazorpayWebhookPayload;
  } catch {
    await PaymentWebhookLogModel.create({
      gatewayId: 'razorpay',
      eventType: 'invalid_json',
      providerEventId: `invalid_${Date.now()}`,
      signatureValid,
      rawPayload: { error: 'invalid_json' },
      processResult: 'rejected',
      processError: 'Invalid JSON body',
    });
    return { ok: false, result: 'invalid_json' };
  }

  const eventType = parsed.event ?? 'unknown';
  const providerEventId =
    (typeof parsed.id === 'string' && parsed.id) ||
    `${eventType}_${parsed.payload?.payment?.entity?.id ?? Date.now()}`;

  try {
    await PaymentWebhookLogModel.create({
      gatewayId: 'razorpay',
      eventType,
      providerEventId,
      signatureValid,
      rawPayload: parsed,
    });
  } catch {
    // Duplicate providerEventId — already processed
    return { ok: true, result: 'duplicate' };
  }

  if (!signatureValid) {
    await PaymentWebhookLogModel.updateOne(
      { providerEventId },
      { $set: { processResult: 'rejected', processError: 'Invalid signature' } },
    );
    return { ok: false, result: 'invalid_signature' };
  }

  if (eventType === 'payment.captured') {
    const entity = parsed.payload?.payment?.entity;
    const providerOrderId = entity?.order_id;
    const providerPaymentId = entity?.id;
    const amount = Number(entity?.amount ?? 0);

    if (!providerOrderId || !providerPaymentId) {
      await PaymentWebhookLogModel.updateOne(
        { providerEventId },
        { $set: { processResult: 'ignored', processError: 'Missing payment fields' } },
      );
      return { ok: true, result: 'ignored' };
    }

    const order = await PaymentOrderModel.findOne({ providerOrderId });
    if (!order) {
      await PaymentWebhookLogModel.updateOne(
        { providerEventId },
        { $set: { processResult: 'ignored', processError: 'Order not found' } },
      );
      return { ok: true, result: 'order_not_found' };
    }

    if (amount !== order.amountMinor || amount !== PREMIUM_AMOUNT_MINOR) {
      await PaymentWebhookLogModel.updateOne(
        { providerEventId },
        { $set: { processResult: 'rejected', processError: 'Amount mismatch' } },
      );
      return { ok: false, result: 'amount_mismatch' };
    }

    const methodInfo = extractRazorpayPaymentMethod(
      entity as unknown as Record<string, unknown>,
    );

    if (order.status !== 'fulfilled') {
      if (order.status === 'pending') {
        await PaymentOrderModel.updateOne(
          { _id: order._id, status: 'pending' },
          {
            $set: {
              status: 'paid',
              paidAt: new Date(),
              providerPaymentId,
              paymentMethod: methodInfo.paymentMethod,
              paymentMethodDetail: methodInfo.paymentMethodDetail,
            },
          },
        );
        await appendPaymentLog({
          orderId: order._id,
          fromStatus: 'pending',
          toStatus: 'paid',
          source: 'webhook',
          message: 'payment.captured',
          meta: {
            providerPaymentId,
            paymentMethod: methodInfo.paymentMethod,
          },
        });
        order.status = 'paid';
      }
      await fulfilPaymentOrder({
        order,
        providerPaymentId,
        paymentMethod: methodInfo.paymentMethod,
        paymentMethodDetail: methodInfo.paymentMethodDetail,
        source: 'webhook',
      });
    } else if (!order.paymentMethod) {
      await PaymentOrderModel.updateOne(
        { _id: order._id },
        {
          $set: {
            paymentMethod: methodInfo.paymentMethod,
            paymentMethodDetail: methodInfo.paymentMethodDetail,
          },
        },
      );
    }

    await PaymentWebhookLogModel.updateOne(
      { providerEventId },
      { $set: { processResult: 'fulfilled' } },
    );
    logger.info('billing.webhook.fulfilled', { providerOrderId, providerEventId });
    return { ok: true, result: 'fulfilled' };
  }

  if (eventType === 'payment.failed') {
    const providerOrderId = parsed.payload?.payment?.entity?.order_id;
    if (providerOrderId) {
      const order = await PaymentOrderModel.findOne({ providerOrderId });
      if (order && ['created', 'pending'].includes(order.status)) {
        await PaymentOrderModel.updateOne(
          { _id: order._id },
          { $set: { status: 'failed', failedAt: new Date(), lastError: 'payment.failed' } },
        );
        await appendPaymentLog({
          orderId: order._id,
          fromStatus: order.status,
          toStatus: 'failed',
          source: 'webhook',
          message: 'payment.failed',
        });
      }
    }
    await PaymentWebhookLogModel.updateOne(
      { providerEventId },
      { $set: { processResult: 'failed_recorded' } },
    );
    return { ok: true, result: 'failed_recorded' };
  }

  await PaymentWebhookLogModel.updateOne(
    { providerEventId },
    { $set: { processResult: 'ignored' } },
  );
  return { ok: true, result: 'ignored' };
}
