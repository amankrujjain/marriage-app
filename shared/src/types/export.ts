import type { ExportFormat } from '../enums/ExportFormat';

export interface ExportRequest {
  format: ExportFormat;
  /** data URL or raw base64 of the rendered biodata preview */
  imageBase64: string;
  fileName?: string;
  /** Active design slug; Free tier skips Wedding Pass (server verifies). */
  designSlug?: string;
  personName?: string;
}

export interface ExportResult {
  url: string;
  format: ExportFormat;
  fileName: string;
  shareText: string;
  whatsappUrl: string;
}
