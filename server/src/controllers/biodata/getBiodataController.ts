import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { getBiodataService } from '../../services/biodata/getBiodataService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function getBiodataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await getBiodataService(req.user.id, req.params.id as string);
    sendSuccess(res, data, 'Biodata fetched successfully');
  } catch (error) {
    next(error);
  }
}
