import type { NextFunction, Request, Response } from 'express';
import { listPublicDesignTemplates } from '../../services/designs/designTemplateService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function listDesignsController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await listPublicDesignTemplates();
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
