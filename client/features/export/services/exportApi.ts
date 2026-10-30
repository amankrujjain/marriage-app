import type {
  BiodataContent,
  ExportFormat,
  ExportResult,
} from '@marriage/shared';
import { apiPost } from '@/lib/apiClient';

export async function requestExport(input: {
  format: ExportFormat;
  imageBase64: string;
  fileName?: string;
  personName?: string;
  designSlug?: string;
}): Promise<ExportResult> {
  return apiPost<ExportResult>('/export', input);
}

export async function requestDocumentExport(input: {
  format: ExportFormat.PDF | ExportFormat.DOCX;
  content: BiodataContent;
  fileName?: string;
  personName?: string;
  designSlug?: string;
}): Promise<ExportResult> {
  return apiPost<ExportResult>('/export/document', input);
}
