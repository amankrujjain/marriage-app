import type { UserPaymentListItem, UserPaymentListResponse } from '@marriage/shared';
import { Types } from 'mongoose';
import { PaymentOrderModel } from '../../models/PaymentOrder';

type LeanOrder = {
  _id: Types.ObjectId;
  planSlug: string;
  amountMinor: number;
  currency: string;
  status: UserPaymentListItem['status'];
  paymentMethod?: string | null;
  paymentMethodDetail?: string | null;
  providerPaymentId?: string | null;
  paidAt?: Date | null;
  fulfilledAt?: Date | null;
  createdAt: Date;
  invoiceKey?: string | null;
  invoiceNumber?: string | null;
};

export async function listUserPaymentsService(input: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<UserPaymentListResponse> {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(50, Math.max(1, input.limit ?? 20));
  const filter = { userId: new Types.ObjectId(input.userId) };

  const [rows, total] = await Promise.all([
    PaymentOrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<LeanOrder[]>(),
    PaymentOrderModel.countDocuments(filter),
  ]);

  const items: UserPaymentListItem[] = rows.map((row) => ({
    id: row._id.toString(),
    planSlug: row.planSlug,
    amountMinor: row.amountMinor,
    amountInr: Math.round(row.amountMinor / 100),
    currency: row.currency,
    status: row.status,
    paymentMethod: row.paymentMethod ?? null,
    paymentMethodDetail: row.paymentMethodDetail ?? null,
    providerPaymentId: row.providerPaymentId ?? null,
    paidAt: row.paidAt ? row.paidAt.toISOString() : null,
    fulfilledAt: row.fulfilledAt ? row.fulfilledAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    hasInvoice: Boolean(row.invoiceKey),
    invoiceNumber: row.invoiceNumber ?? null,
  }));

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
