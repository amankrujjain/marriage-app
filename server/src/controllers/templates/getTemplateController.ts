import type { NextFunction, Request, Response } from 'express';
import { getTemplateDefinition } from '../../services/templates/templateService';
import { sendSuccess } from '../../utils/sendSuccess';

export function getTemplateController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = getTemplateDefinition(req.params.id as string);
    sendSuccess(res, data, 'Template fetched successfully');
  } catch (error) {
    next(error);
  }
}
