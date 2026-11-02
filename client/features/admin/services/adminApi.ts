import type {
  AdminBlogPost,
  AdminBlogPostSummary,
  BlogImageUploadResult,
  BlogPostStatus,
  BlogSeoScorePayload,
  BlogSeoScoreResult,
  CreateBlogPostPayload,
  ScheduleBlogPostPayload,
  UpdateBlogPostPayload,
} from '@marriage/shared';
import {
  apiDelete,
  apiGet,
  apiGetPaginated,
  apiPatch,
  apiPost,
  apiUpload,
} from '@/lib/apiClient';

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

export type AdminBlogListQuery = {
  page?: number;
  limit?: number;
  status?: BlogPostStatus | '';
  search?: string;
};

export type AdminBlogListResult = {
  items: AdminBlogPostSummary[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export async function listAdminBlogPosts(
  query: AdminBlogListQuery = {},
): Promise<AdminBlogListResult> {
  const result = await apiGetPaginated<AdminBlogPostSummary>(
    `/admin/blog${toQuery({
      page: query.page ?? 1,
      limit: query.limit ?? 25,
      status: query.status || undefined,
      search: query.search,
    })}`,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(result.meta.total / Math.max(1, result.meta.limit)),
  );
  return {
    items: result.items,
    meta: { ...result.meta, totalPages },
  };
}

export async function getAdminBlogPost(id: string): Promise<AdminBlogPost> {
  return apiGet<AdminBlogPost>(`/admin/blog/${id}`);
}

export async function createAdminBlogPost(
  payload: CreateBlogPostPayload,
): Promise<AdminBlogPost> {
  return apiPost<AdminBlogPost>('/admin/blog', payload);
}

export async function updateAdminBlogPost(
  id: string,
  payload: UpdateBlogPostPayload,
): Promise<AdminBlogPost> {
  return apiPatch<AdminBlogPost>(`/admin/blog/${id}`, payload);
}

export async function deleteAdminBlogPost(id: string): Promise<null> {
  return apiDelete<null>(`/admin/blog/${id}`);
}

export async function publishAdminBlogPost(id: string): Promise<AdminBlogPost> {
  return apiPost<AdminBlogPost>(`/admin/blog/${id}/publish`);
}

export async function unpublishAdminBlogPost(
  id: string,
): Promise<AdminBlogPost> {
  return apiPost<AdminBlogPost>(`/admin/blog/${id}/unpublish`);
}

export async function scheduleAdminBlogPost(
  id: string,
  payload: ScheduleBlogPostPayload,
): Promise<AdminBlogPost> {
  return apiPost<AdminBlogPost>(`/admin/blog/${id}/schedule`, payload);
}

export async function scoreAdminBlogPost(
  payload: BlogSeoScorePayload,
): Promise<BlogSeoScoreResult> {
  return apiPost<BlogSeoScoreResult>('/admin/blog/score', payload);
}

export async function uploadAdminBlogImage(
  file: File,
): Promise<BlogImageUploadResult> {
  const form = new FormData();
  form.append('image', file);
  return apiUpload<BlogImageUploadResult>('/admin/blog/images', form);
}

export async function setAdminBlogCover(
  id: string,
  file: File,
): Promise<AdminBlogPost> {
  const form = new FormData();
  form.append('image', file);
  return apiUpload<AdminBlogPost>(`/admin/blog/${id}/cover`, form);
}

export async function removeAdminBlogCover(id: string): Promise<AdminBlogPost> {
  return apiDelete<AdminBlogPost>(`/admin/blog/${id}/cover`);
}

