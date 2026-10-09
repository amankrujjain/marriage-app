import {
  getTemplateById,
  isTemplateId,
  listTemplates,
  type TemplateDefinition,
  type TemplateId,
} from '@marriage/shared';
import { NotFoundError } from '../../errors/NotFoundError';
import { BadRequestError } from '../../errors/BadRequestError';

export function listTemplateDefinitions(): TemplateDefinition[] {
  return listTemplates();
}

export function getTemplateDefinition(id: string): TemplateDefinition {
  if (!isTemplateId(id)) {
    throw new BadRequestError('Invalid template id', 'INVALID_TEMPLATE_ID');
  }
  const template = getTemplateById(id as TemplateId);
  if (!template) {
    throw new NotFoundError('Template not found', 'TEMPLATE_NOT_FOUND');
  }
  return template;
}
