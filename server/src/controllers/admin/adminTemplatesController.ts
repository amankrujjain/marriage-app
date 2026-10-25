import type { NextFunction, Request, Response } from 'express';
import {
  listAdminDesignTemplates,
  updateAdminDesignTemplate,
} from '../../services/designs/designTemplateService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function adminListTemplatesController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await listAdminDesignTemplates();
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateTemplateController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = String(req.params.slug ?? '');
    const data = await updateAdminDesignTemplate(slug, req.body ?? {});
    sendSuccess(res, data, 'Template updated');
  } catch (error) {
    next(error);
  }
}
