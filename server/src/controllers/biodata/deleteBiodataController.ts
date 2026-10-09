import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { deleteBiodataService } from '../../services/biodata/deleteBiodataService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function deleteBiodataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    await deleteBiodataService(req.user.id, req.params.id as string);
    sendSuccess(res, null, 'Biodata deleted successfully');
  } catch (error) {
    next(error);
  }
}
