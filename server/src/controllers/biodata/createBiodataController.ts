import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { createBiodataService } from '../../services/biodata/createBiodataService';
import { sendCreated } from '../../utils/sendCreated';

export async function createBiodataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await createBiodataService(req.user.id, req.body);
    sendCreated(res, data, 'Biodata created successfully');
  } catch (error) {
    next(error);
  }
}
