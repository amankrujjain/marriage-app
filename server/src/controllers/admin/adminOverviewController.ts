import type { NextFunction, Request, Response } from 'express';
import { getAdminOverview } from '../../services/admin/adminOverviewService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function adminOverviewController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;
    const granularity =
      typeof req.query.granularity === 'string' ? req.query.granularity : undefined;
    const data = await getAdminOverview({ from, to, granularity });
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
