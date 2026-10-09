import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { uploadPhotoService } from '../../services/biodata/uploadPhotoService';
import { sendCreated } from '../../utils/sendCreated';

export async function uploadPhotoController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await uploadPhotoService(req.file);
    sendCreated(res, data, 'Photo uploaded successfully');
  } catch (error) {
    next(error);
  }
}
