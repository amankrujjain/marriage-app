import { TemplateId } from '../../enums/TemplateId';
import type { TemplateDefinition } from '../../types/template';
import { TEMPLATE_DEFINITIONS } from './templateList';

export function listTemplates(): TemplateDefinition[] {
  return TEMPLATE_DEFINITIONS;
}

export function getTemplateById(id: TemplateId): TemplateDefinition | undefined {
  return TEMPLATE_DEFINITIONS.find((item) => item.id === id);
}

export function isTemplateId(value: string): value is TemplateId {
  return Object.values(TemplateId).includes(value as TemplateId);
}
