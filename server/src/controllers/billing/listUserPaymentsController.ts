import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { listUserPaymentsService } from '../../services/billing/listUserPaymentsService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function listUserPaymentsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await listUserPaymentsService({
      userId: req.user.id,
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 20,
    });
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
