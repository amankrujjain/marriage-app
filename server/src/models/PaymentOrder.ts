import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import type { PaymentOrderStatus } from '@marriage/shared';

export interface PaymentOrderFields {
  userId: Types.ObjectId;
  planSlug: string;
  amountMinor: number;
  currency: string;
  status: PaymentOrderStatus;
  idempotencyKey: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  /** Razorpay method: upi | card | netbanking | wallet | … */
  paymentMethod?: string | null;
  /** Human label e.g. "Credit card · Visa ••4242" */
  paymentMethodDetail?: string | null;
  paidAt?: Date | null;
  fulfilledAt?: Date | null;
  cancelledAt?: Date | null;
  failedAt?: Date | null;
  lastError?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentOrderSchema = new Schema<PaymentOrderFields>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planSlug: { type: String, required: true, trim: true },
    amountMinor: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, uppercase: true, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'pending', 'paid', 'fulfilled', 'cancelled', 'failed', 'refunded'],
      required: true,
      index: true,
    },
    idempotencyKey: { type: String, required: true, trim: true },
    providerOrderId: { type: String, trim: true, index: true },
    providerPaymentId: { type: String, trim: true },
    paymentMethod: { type: String, trim: true, default: null, index: true },
    paymentMethodDetail: { type: String, trim: true, default: null },
    paidAt: { type: Date, default: null },
    fulfilledAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    lastError: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

paymentOrderSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true });
paymentOrderSchema.index(
  { providerOrderId: 1 },
  { unique: true, partialFilterExpression: { providerOrderId: { $type: 'string' } } },
);
paymentOrderSchema.index({ status: 1, createdAt: -1 });

export type PaymentOrderDocument = HydratedDocument<PaymentOrderFields> & {
  _id: Types.ObjectId;
};

export const PaymentOrderModel = model<PaymentOrderFields>(
  'PaymentOrder',
  paymentOrderSchema,
);
