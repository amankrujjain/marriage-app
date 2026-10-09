import { ExportFormat } from '@marriage/shared';
import type { ExportArtifact, ExportProvider } from './ExportProvider';

export class PngExportProvider implements ExportProvider {
  readonly format = ExportFormat.PNG;

  async create(imageBuffer: Buffer): Promise<ExportArtifact> {
    return {
      buffer: imageBuffer,
      mimeType: 'image/png',
      extension: 'png',
      format: ExportFormat.PNG,
    };
  }
}

export class JpgExportProvider implements ExportProvider {
  readonly format = ExportFormat.JPG;

  async create(imageBuffer: Buffer): Promise<ExportArtifact> {
    return {
      buffer: imageBuffer,
      mimeType: 'image/jpeg',
      extension: 'jpg',
      format: ExportFormat.JPG,
    };
  }
}
