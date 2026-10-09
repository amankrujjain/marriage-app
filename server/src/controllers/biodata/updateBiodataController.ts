import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { updateBiodataService } from '../../services/biodata/updateBiodataService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function updateBiodataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await updateBiodataService(
      req.user.id,
      req.params.id as string,
      req.body,
    );
    sendSuccess(res, data, 'Biodata updated successfully');
  } catch (error) {
    next(error);
  }
}
