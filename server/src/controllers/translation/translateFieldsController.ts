import type { NextFunction, Request, Response } from 'express';
import { translateStructuredFields } from '../../services/translation/translationService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function translateFieldsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await translateStructuredFields(req.body);
    sendSuccess(res, data, 'Fields translated successfully');
  } catch (error) {
    next(error);
  }
}
