import type {
  BillingMeResponse,
  BillingPlanPublic,
  CheckoutResponse,
  PublicUser,
  VerifyPaymentPayload,
} from '@marriage/shared';
import { apiGet, apiPost } from '@/lib/apiClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export async function listBillingPlans(): Promise<BillingPlanPublic[]> {
  return apiGet<BillingPlanPublic[]>('/billing/plans');
}

export async function fetchBillingMe(): Promise<BillingMeResponse> {
  return apiGet<BillingMeResponse>('/billing/me');
}

export async function checkoutWeddingPass(
  idempotencyKey: string,
): Promise<CheckoutResponse> {
  const response = await fetch(`${API_BASE}/billing/checkout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    credentials: 'include',
    cache: 'no-store',
  });
  const json = (await response.json()) as {
    success: boolean;
    message?: string;
    data?: CheckoutResponse;
    error?: { code?: string };
  };
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? 'Checkout failed');
  }
  return json.data;
}

export async function verifyWeddingPassPayment(
  payload: VerifyPaymentPayload,
): Promise<{ orderId: string; user: PublicUser }> {
  return apiPost<{ orderId: string; user: PublicUser }>(
    '/billing/razorpay/verify',
    payload,
  );
}
