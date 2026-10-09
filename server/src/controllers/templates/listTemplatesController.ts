import type { Request, Response } from 'express';
import { listTemplateDefinitions } from '../../services/templates/templateService';
import { sendSuccess } from '../../utils/sendSuccess';

export function listTemplatesController(_req: Request, res: Response): void {
  sendSuccess(res, listTemplateDefinitions(), 'Templates fetched successfully');
}
