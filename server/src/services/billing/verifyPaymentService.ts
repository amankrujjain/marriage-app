import type { PublicUser } from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import { NotFoundError } from '../../errors/NotFoundError';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { findUserById } from '../../repositories/userRepository';
import {
  getRazorpayClient,
  verifyCheckoutSignature,
} from '../../providers/razorpay/razorpayClient';
import { PREMIUM_AMOUNT_MINOR } from '@marriage/shared';
import { appendPaymentLog } from './paymentLogService';
import { fulfilPaymentOrder } from './fulfilPremiumService';
import { toPublicUser } from '../../utils/toPublicUser';
import { extractRazorpayPaymentMethod } from '../../utils/razorpayPaymentMethod';

export async function verifyRazorpayPayment(input: {
  userId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}): Promise<{ orderId: string; user: PublicUser }> {
  const valid = verifyCheckoutSignature({
    providerOrderId: input.providerOrderId,
    providerPaymentId: input.providerPaymentId,
    signature: input.signature,
  });
  if (!valid) {
    throw new BadRequestError('Invalid payment signature', 'PAYMENT_SIGNATURE_INVALID');
  }

  const order = await PaymentOrderModel.findOne({
    providerOrderId: input.providerOrderId,
    userId: input.userId,
  });
  if (!order) {
    throw new NotFoundError('Payment order not found', 'ORDER_NOT_FOUND');
  }

  const razorpay = getRazorpayClient();
  const payment = await razorpay.payments.fetch(input.providerPaymentId);
  const amount = Number(payment.amount);
  const status = String(payment.status);
  const paymentOrderId = String(payment.order_id ?? '');
  const methodInfo = extractRazorpayPaymentMethod(
    payment as unknown as Record<string, unknown>,
  );

  if (order.status === 'fulfilled') {
    if (!order.paymentMethod) {
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
    const user = await findUserById(input.userId);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return { orderId: order._id.toString(), user: toPublicUser(user) };
  }

  if (paymentOrderId !== input.providerOrderId) {
    throw new BadRequestError('Payment order mismatch', 'PAYMENT_ORDER_MISMATCH');
  }
  if (status !== 'captured') {
    await PaymentOrderModel.updateOne(
      { _id: order._id, status: { $in: ['pending', 'paid'] } },
      { $set: { status: 'failed', failedAt: new Date(), lastError: `status=${status}` } },
    );
    await appendPaymentLog({
      orderId: order._id,
      fromStatus: order.status,
      toStatus: 'failed',
      source: 'client',
      message: `Payment not captured (${status})`,
    });
    throw new BadRequestError('Payment not captured', 'PAYMENT_NOT_CAPTURED');
  }
  if (amount !== order.amountMinor || amount !== PREMIUM_AMOUNT_MINOR) {
    throw new BadRequestError('Payment amount mismatch', 'PAYMENT_AMOUNT_MISMATCH');
  }

  if (order.status === 'pending') {
    await PaymentOrderModel.updateOne(
      { _id: order._id, status: 'pending' },
      {
        $set: {
          status: 'paid',
          paidAt: new Date(),
          providerPaymentId: input.providerPaymentId,
          paymentMethod: methodInfo.paymentMethod,
          paymentMethodDetail: methodInfo.paymentMethodDetail,
        },
      },
    );
    await appendPaymentLog({
      orderId: order._id,
      fromStatus: 'pending',
      toStatus: 'paid',
      source: 'client',
      message: 'Payment captured (verify)',
      meta: {
        providerPaymentId: input.providerPaymentId,
        paymentMethod: methodInfo.paymentMethod,
      },
    });
    order.status = 'paid';
    order.providerPaymentId = input.providerPaymentId;
    order.paymentMethod = methodInfo.paymentMethod;
    order.paymentMethodDetail = methodInfo.paymentMethodDetail;
  }

  await fulfilPaymentOrder({
    order,
    providerPaymentId: input.providerPaymentId,
    paymentMethod: methodInfo.paymentMethod,
    paymentMethodDetail: methodInfo.paymentMethodDetail,
    source: 'client',
  });

  const user = await findUserById(input.userId);
  if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
  return { orderId: order._id.toString(), user: toPublicUser(user) };
}
