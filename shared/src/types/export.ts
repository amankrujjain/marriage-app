import type { ExportFormat } from '../enums/ExportFormat';
import type { BiodataContent } from './biodata';

export interface ExportRequest {
  format: ExportFormat;
  /** data URL or raw base64 of the rendered biodata preview */
  imageBase64: string;
  fileName?: string;
  /** Active design slug; Free tier skips Wedding Pass (server verifies). */
  designSlug?: string;
  personName?: string;
}

export interface DocumentExtraSection {
  title: string;
  lines: Array<{ label: string; value: string }>;
}

/** Server-rendered selectable PDF / Word (not a screenshot). */
export interface DocumentExportRequest {
  format: ExportFormat.PDF | ExportFormat.DOCX;
  content: BiodataContent;
  fileName?: string;
  designSlug?: string;
  personName?: string;
  extraSections?: DocumentExtraSection[];
}

export interface ExportResult {
  url: string;
  format: ExportFormat;
  fileName: string;
  shareText: string;
  whatsappUrl: string;
}
