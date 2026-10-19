import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import type { PaymentOrderStatus } from '@marriage/shared';

export type PaymentLogSource = 'client' | 'server' | 'webhook' | 'reconcile';

export interface PaymentLogFields {
  orderId: Types.ObjectId;
  fromStatus?: PaymentOrderStatus | null;
  toStatus: PaymentOrderStatus;
  source: PaymentLogSource;
  message?: string;
  meta?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentLogSchema = new Schema<PaymentLogFields>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'PaymentOrder', required: true, index: true },
    fromStatus: { type: String, default: null },
    toStatus: { type: String, required: true },
    source: {
      type: String,
      enum: ['client', 'server', 'webhook', 'reconcile'],
      required: true,
    },
    message: { type: String },
    meta: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export type PaymentLogDocument = HydratedDocument<PaymentLogFields> & {
  _id: Types.ObjectId;
};

export const PaymentLogModel = model<PaymentLogFields>('PaymentLog', paymentLogSchema);
