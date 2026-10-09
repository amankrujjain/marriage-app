import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { listBiodataService } from '../../services/biodata/listBiodataService';
import { sendPaginated } from '../../utils/sendPaginated';

export async function listBiodataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const { items, total } = await listBiodataService(req.user.id, page, limit);
    sendPaginated(res, items, { page, limit, total }, 'Biodatas fetched successfully');
  } catch (error) {
    next(error);
  }
}
