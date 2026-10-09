import type { NextFunction, Request, Response } from 'express';
import { translateBiodataContent } from '../../services/translation/translationService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function translateBiodataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await translateBiodataContent(req.body);
    sendSuccess(res, data, 'Biodata translated successfully');
  } catch (error) {
    next(error);
  }
}
