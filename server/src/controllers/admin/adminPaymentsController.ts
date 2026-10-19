import type { NextFunction, Request, Response } from 'express';
import {
  exportAdminPayments,
  listAdminPayments,
} from '../../services/admin/adminPaymentsService';
import { sendSuccess } from '../../utils/sendSuccess';

function queryFilters(req: Request) {
  return {
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
    method: typeof req.query.method === 'string' ? req.query.method : undefined,
    from: typeof req.query.from === 'string' ? req.query.from : undefined,
    to: typeof req.query.to === 'string' ? req.query.to : undefined,
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
  };
}

export async function adminPaymentsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const data = await listAdminPayments({ page, limit, ...queryFilters(req) });
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}

export async function adminPaymentsExportController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const items = await exportAdminPayments(queryFilters(req));
    const header = [
      'id',
      'createdAt',
      'status',
      'amountInr',
      'currency',
      'planSlug',
      'paymentMethod',
      'paymentMethodDetail',
      'userId',
      'userName',
      'userEmail',
      'providerOrderId',
      'providerPaymentId',
      'paidAt',
      'fulfilledAt',
      'cancelledAt',
      'failedAt',
      'lastError',
    ];

    const escape = (v: string | number | null | undefined) => {
      const s = v == null ? '' : String(v);
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = [
      header.join(','),
      ...items.map((p) =>
        [
          p.id,
          p.createdAt,
          p.status,
          p.amountInr,
          p.currency,
          p.planSlug,
          p.paymentMethod,
          p.paymentMethodDetail,
          p.userId,
          p.userName,
          p.userEmail,
          p.providerOrderId,
          p.providerPaymentId,
          p.paidAt,
          p.fulfilledAt,
          p.cancelledAt,
          p.failedAt,
          p.lastError,
        ]
          .map(escape)
          .join(','),
      ),
    ];

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="wedding-pass-payments-${stamp}.csv"`,
    );
    res.status(200).send(lines.join('\n'));
  } catch (error) {
    next(error);
  }
}
