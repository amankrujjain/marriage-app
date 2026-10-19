export type PaymentOrderStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'fulfilled'
  | 'cancelled'
  | 'failed'
  | 'refunded';

export interface BillingPlanPublic {
  slug: string;
  name: string;
  description: string;
  amountMinor: number;
  amountInr: number;
  currency: string;
  durationDays: number;
}

export interface CheckoutResponse {
  orderId: string;
  providerOrderId: string;
  amountMinor: number;
  currency: string;
  keyId: string;
  planSlug: string;
  planName: string;
}

export interface VerifyPaymentPayload {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export interface BillingMeResponse {
  isPremium: boolean;
  premiumUntil: string | null;
  planSlug: string | null;
}
