import type { ExportFormat } from '@marriage/shared';

export interface ExportArtifact {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  format: ExportFormat;
}

export interface ExportProvider {
  readonly format: ExportFormat;
  create(imageBuffer: Buffer): Promise<ExportArtifact>;
}
