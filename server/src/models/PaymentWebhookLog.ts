import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export interface PaymentWebhookLogFields {
  gatewayId: string;
  eventType: string;
  providerEventId: string;
  signatureValid: boolean;
  rawPayload: unknown;
  processResult?: string | null;
  processError?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentWebhookLogSchema = new Schema<PaymentWebhookLogFields>(
  {
    gatewayId: { type: String, required: true, default: 'razorpay' },
    eventType: { type: String, required: true },
    providerEventId: { type: String, required: true, unique: true },
    signatureValid: { type: Boolean, required: true },
    rawPayload: { type: Schema.Types.Mixed, required: true },
    processResult: { type: String, default: null },
    processError: { type: String, default: null },
  },
  { timestamps: true },
);

export type PaymentWebhookLogDocument = HydratedDocument<PaymentWebhookLogFields> & {
  _id: Types.ObjectId;
};

export const PaymentWebhookLogModel = model<PaymentWebhookLogFields>(
  'PaymentWebhookLog',
  paymentWebhookLogSchema,
);
