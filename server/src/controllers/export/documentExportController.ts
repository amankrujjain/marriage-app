import type { NextFunction, Request, Response } from 'express';
import { ExportFormat } from '@marriage/shared';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { exportBiodataDocument } from '../../services/export/documentExportService';
import { sendCreated } from '../../utils/sendCreated';

export async function documentExportController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const format = req.body.format as ExportFormat.PDF | ExportFormat.DOCX;
    const data = await exportBiodataDocument({
      userId: req.user.id,
      format,
      content: req.body.content,
      fileName: req.body.fileName as string | undefined,
      personName: req.body.personName as string | undefined,
      designSlug: req.body.designSlug as string | undefined,
    });
    sendCreated(res, data, 'Document export created successfully');
  } catch (error) {
    next(error);
  }
}
