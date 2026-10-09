import type { TemplateDefinition } from '@marriage/shared';
import { apiGet } from '@/lib/apiClient';

export async function fetchTemplates(): Promise<TemplateDefinition[]> {
  return apiGet<TemplateDefinition[]>('/templates');
}

export async function fetchTemplate(id: string): Promise<TemplateDefinition> {
  return apiGet<TemplateDefinition>(`/templates/${id}`);
}
