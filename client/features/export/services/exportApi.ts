import type { ExportFormat, ExportResult } from '@marriage/shared';
import { apiPost } from '@/lib/apiClient';

export async function requestExport(input: {
  format: ExportFormat;
  imageBase64: string;
  fileName?: string;
  personName?: string;
}): Promise<ExportResult> {
  return apiPost<ExportResult>('/export', input);
}
