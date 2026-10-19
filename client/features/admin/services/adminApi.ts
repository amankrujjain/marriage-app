import { apiGet } from '@/lib/apiClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export type AdminIncomePoint = {
  period: string;
  label: string;
  amountInr: number;
  count: number;
};

export type AdminOverview = {
  users: number;
  activeWeddingPass: number;
  biodatas: number;
  paymentsFulfilled: number;
  paymentsPending: number;
  paymentsFailed: number;
  revenueInr: number;
  range: {
    from: string;
    to: string;
    granularity: 'day' | 'week' | 'month';
    incomeInr: number;
    orderCount: number;
  };
  incomeSeries: AdminIncomePoint[];
  statusBreakdown: Array<{ status: string; count: number; amountInr: number }>;
};

export type AdminPayment = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  planSlug: string;
  amountInr: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paymentMethodDetail: string | null;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  paidAt: string | null;
  fulfilledAt: string | null;
  cancelledAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastError: string | null;
};

export type AdminPaymentsResult = {
  items: AdminPayment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AdminOverviewQuery = {
  from?: string;
  to?: string;
  granularity?: 'day' | 'week' | 'month';
};

export type AdminPaymentsQuery = {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  from?: string;
  to?: string;
  q?: string;
};

function toQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') q.set(key, String(value));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function fetchAdminOverview(
  query: AdminOverviewQuery = {},
): Promise<AdminOverview> {
  return apiGet<AdminOverview>(`/admin/overview${toQuery(query)}`);
}

export async function fetchAdminPayments(
  query: AdminPaymentsQuery = {},
): Promise<AdminPaymentsResult> {
  return apiGet<AdminPaymentsResult>(
    `/admin/payments${toQuery({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      status: query.status,
      method: query.method,
      from: query.from,
      to: query.to,
      q: query.q,
    })}`,
  );
}

export async function downloadAdminPaymentsCsv(
  query: Omit<AdminPaymentsQuery, 'page' | 'limit'> = {},
): Promise<void> {
  const path = `/admin/payments/export${toQuery({
    status: query.status,
    method: query.method,
    from: query.from,
    to: query.to,
    q: query.q,
  })}`;
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to export payments');
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wedding-pass-payments-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
