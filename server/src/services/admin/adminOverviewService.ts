import { UserModel } from '../../models/User';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { BiodataModel } from '../../models/Biodata';
import { isPremium } from '../../utils/isPremium';

export type IncomeGranularity = 'day' | 'week' | 'month';

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseDateParam(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

function formatBucketLabel(date: Date, granularity: IncomeGranularity): string {
  if (granularity === 'month') {
    return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  }
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function dateTruncUnit(granularity: IncomeGranularity): 'day' | 'week' | 'month' {
  return granularity;
}

export async function getAdminOverview(input: {
  from?: string;
  to?: string;
  granularity?: string;
}) {
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 29);

  const from = startOfUtcDay(parseDateParam(input.from, defaultFrom));
  const toRaw = parseDateParam(input.to, now);
  const to = new Date(toRaw);
  to.setUTCHours(23, 59, 59, 999);

  const granularity: IncomeGranularity =
    input.granularity === 'week' || input.granularity === 'month'
      ? input.granularity
      : 'day';

  const [userCount, biodataCount, paidOrders, pendingOrders, failedOrders] =
    await Promise.all([
      UserModel.countDocuments(),
      BiodataModel.countDocuments(),
      PaymentOrderModel.countDocuments({ status: 'fulfilled' }),
      PaymentOrderModel.countDocuments({ status: { $in: ['pending', 'created', 'paid'] } }),
      PaymentOrderModel.countDocuments({ status: { $in: ['failed', 'cancelled'] } }),
    ]);

  const users = await UserModel.find({}, { premiumUntil: 1 }).lean();
  const activePass = users.filter((u) => isPremium(u.premiumUntil)).length;

  const matchRange = {
    status: 'fulfilled' as const,
    fulfilledAt: { $gte: from, $lte: to },
  };

  const [revenueAgg, seriesAgg, statusAgg] = await Promise.all([
    PaymentOrderModel.aggregate<{ total: number; count: number }>([
      { $match: matchRange },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountMinor' },
          count: { $sum: 1 },
        },
      },
    ]),
    PaymentOrderModel.aggregate<{ _id: Date; total: number; count: number }>([
      { $match: matchRange },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$fulfilledAt',
              unit: dateTruncUnit(granularity),
              timezone: 'UTC',
            },
          },
          total: { $sum: '$amountMinor' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    PaymentOrderModel.aggregate<{ _id: string; total: number; count: number }>([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amountMinor' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  const incomeSeries = seriesAgg.map((row) => {
    const bucket = new Date(row._id);
    return {
      period: bucket.toISOString(),
      label: formatBucketLabel(bucket, granularity),
      amountInr: Math.round(row.total / 100),
      count: row.count,
    };
  });

  return {
    users: userCount,
    activeWeddingPass: activePass,
    biodatas: biodataCount,
    paymentsFulfilled: paidOrders,
    paymentsPending: pendingOrders,
    paymentsFailed: failedOrders,
    revenueInr: Math.round(
      (await PaymentOrderModel.aggregate<{ total: number }>([
        { $match: { status: 'fulfilled' } },
        { $group: { _id: null, total: { $sum: '$amountMinor' } } },
      ]))[0]?.total ?? 0,
    ) / 100,
    range: {
      from: from.toISOString(),
      to: to.toISOString(),
      granularity,
      incomeInr: Math.round((revenueAgg[0]?.total ?? 0) / 100),
      orderCount: revenueAgg[0]?.count ?? 0,
    },
    incomeSeries,
    statusBreakdown: statusAgg.map((row) => ({
      status: row._id,
      count: row.count,
      amountInr: Math.round(row.total / 100),
    })),
  };
}
