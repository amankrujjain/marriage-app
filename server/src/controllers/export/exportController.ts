import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { exportBiodata } from '../../services/export/exportService';
import { sendCreated } from '../../utils/sendCreated';

export async function exportController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await exportBiodata({
      userId: req.user.id,
      format: req.body.format,
      imageBase64: req.body.imageBase64 as string,
      fileName: req.body.fileName as string | undefined,
      personName: req.body.personName as string | undefined,
    });
    sendCreated(res, data, 'Export created successfully');
  } catch (error) {
    next(error);
  }
}
