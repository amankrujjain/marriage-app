import { Types } from 'mongoose';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { UserModel } from '../../models/User';
import { getRazorpayClient } from '../../providers/razorpay/razorpayClient';
import { extractRazorpayPaymentMethod } from '../../utils/razorpayPaymentMethod';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

const STATUSES = new Set([
  'created',
  'pending',
  'paid',
  'fulfilled',
  'cancelled',
  'failed',
  'refunded',
]);

const METHODS = new Set([
  'upi',
  'card',
  'netbanking',
  'wallet',
  'emi',
  'cardless_emi',
  'paylater',
  'unknown',
]);

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseOptionalDate(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  if (endOfDay) {
    d.setUTCHours(23, 59, 59, 999);
    return d;
  }
  return startOfUtcDay(d);
}

async function buildPaymentFilter(input: {
  status?: string;
  method?: string;
  from?: string;
  to?: string;
  q?: string;
}): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  if (input.status && STATUSES.has(input.status)) {
    filter.status = input.status;
  }

  if (input.method && METHODS.has(input.method)) {
    filter.paymentMethod = input.method;
  }

  const from = parseOptionalDate(input.from);
  const to = parseOptionalDate(input.to, true);
  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
    };
  }

  const q = input.q?.trim();
  if (q) {
    const or: Record<string, unknown>[] = [
      { providerOrderId: { $regex: q, $options: 'i' } },
      { providerPaymentId: { $regex: q, $options: 'i' } },
      { planSlug: { $regex: q, $options: 'i' } },
      { paymentMethod: { $regex: q, $options: 'i' } },
      { paymentMethodDetail: { $regex: q, $options: 'i' } },
    ];
    if (Types.ObjectId.isValid(q)) {
      or.push({ _id: new Types.ObjectId(q) });
      or.push({ userId: new Types.ObjectId(q) });
    }
    const users = await UserModel.find({
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ],
    })
      .select('_id')
      .limit(50)
      .lean();
    if (users.length) {
      or.push({ userId: { $in: users.map((u) => u._id) } });
    }
    filter.$or = or;
  }

  return filter;
}

type LeanPayment = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planSlug: string;
  amountMinor: number;
  currency: string;
  status: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  paymentMethod?: string | null;
  paymentMethodDetail?: string | null;
  paidAt?: Date | null;
  fulfilledAt?: Date | null;
  cancelledAt?: Date | null;
  failedAt?: Date | null;
  lastError?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

async function backfillPaymentMethods(items: LeanPayment[]): Promise<LeanPayment[]> {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return items;

  const missing = items.filter(
    (p) => !p.paymentMethod && p.providerPaymentId,
  );
  if (!missing.length) return items;

  const razorpay = getRazorpayClient();
  const byId = new Map(items.map((p) => [String(p._id), p]));

  await Promise.all(
    missing.slice(0, 10).map(async (p) => {
      try {
        const payment = await razorpay.payments.fetch(p.providerPaymentId!);
        const methodInfo = extractRazorpayPaymentMethod(
          payment as unknown as Record<string, unknown>,
        );
        await PaymentOrderModel.updateOne(
          { _id: p._id },
          {
            $set: {
              paymentMethod: methodInfo.paymentMethod,
              paymentMethodDetail: methodInfo.paymentMethodDetail,
            },
          },
        );
        const current = byId.get(String(p._id));
        if (current) {
          current.paymentMethod = methodInfo.paymentMethod;
          current.paymentMethodDetail = methodInfo.paymentMethodDetail;
        }
      } catch (err) {
        logger.warn('admin.payments.method_backfill_failed', {
          orderId: String(p._id),
          message: err instanceof Error ? err.message : 'unknown',
        });
      }
    }),
  );

  return items;
}

async function enrichPayments(items: LeanPayment[]) {
  const withMethods = await backfillPaymentMethods(items);
  const userIds = [...new Set(withMethods.map((p) => String(p.userId)))];
  const users = await UserModel.find({ _id: { $in: userIds } })
    .select('name email')
    .lean();
  const byId = new Map(users.map((u) => [String(u._id), u]));

  return withMethods.map((p) => {
    const user = byId.get(String(p.userId));
    return {
      id: String(p._id),
      userId: String(p.userId),
      userName: user?.name ?? null,
      userEmail: user?.email ?? null,
      planSlug: p.planSlug,
      amountInr: Math.round(p.amountMinor / 100),
      currency: p.currency,
      status: p.status,
      paymentMethod: p.paymentMethod ?? null,
      paymentMethodDetail: p.paymentMethodDetail ?? null,
      providerOrderId: p.providerOrderId ?? null,
      providerPaymentId: p.providerPaymentId ?? null,
      paidAt: p.paidAt ? new Date(p.paidAt).toISOString() : null,
      fulfilledAt: p.fulfilledAt ? new Date(p.fulfilledAt).toISOString() : null,
      cancelledAt: p.cancelledAt ? new Date(p.cancelledAt).toISOString() : null,
      failedAt: p.failedAt ? new Date(p.failedAt).toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      lastError: p.lastError ?? null,
    };
  });
}

export async function listAdminPayments(input: {
  page: number;
  limit: number;
  status?: string;
  method?: string;
  from?: string;
  to?: string;
  q?: string;
}) {
  const page = Math.max(1, input.page);
  const limit = Math.min(50, Math.max(1, input.limit));
  const filter = await buildPaymentFilter(input);

  const [items, total] = await Promise.all([
    PaymentOrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<LeanPayment[]>(),
    PaymentOrderModel.countDocuments(filter),
  ]);

  return {
    items: await enrichPayments(items),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function exportAdminPayments(input: {
  status?: string;
  method?: string;
  from?: string;
  to?: string;
  q?: string;
}) {
  const filter = await buildPaymentFilter(input);
  const items = await PaymentOrderModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(5000)
    .lean<LeanPayment[]>();
  return enrichPayments(items);
}
