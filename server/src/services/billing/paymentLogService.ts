import type { PaymentOrderStatus } from '@marriage/shared';
import { PaymentLogModel, type PaymentLogSource } from '../../models/PaymentLog';
import type { Types } from 'mongoose';

export async function appendPaymentLog(input: {
  orderId: Types.ObjectId | string;
  fromStatus?: PaymentOrderStatus | null;
  toStatus: PaymentOrderStatus;
  source: PaymentLogSource;
  message?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  await PaymentLogModel.create({
    orderId: input.orderId,
    fromStatus: input.fromStatus ?? null,
    toStatus: input.toStatus,
    source: input.source,
    message: input.message,
    meta: input.meta ?? null,
  });
}
