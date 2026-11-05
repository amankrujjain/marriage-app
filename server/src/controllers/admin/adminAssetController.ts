import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { uploadAdminAssetService } from '../../services/admin/adminAssetService';
import { sendCreated } from '../../utils/sendCreated';

export async function adminUploadAssetController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const kind = req.body?.kind ?? req.query?.kind;
    const data = await uploadAdminAssetService({ file: req.file, kind });
    sendCreated(res, data, 'Asset uploaded');
  } catch (error) {
    next(error);
  }
}
