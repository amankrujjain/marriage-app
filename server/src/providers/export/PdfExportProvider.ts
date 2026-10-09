import { PDFDocument } from 'pdf-lib';
import { ExportFormat } from '@marriage/shared';
import type { ExportArtifact, ExportProvider } from './ExportProvider';

export class PdfExportProvider implements ExportProvider {
  readonly format = ExportFormat.PDF;

  async create(imageBuffer: Buffer): Promise<ExportArtifact> {
    const pdf = await PDFDocument.create();
    const isJpeg = imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8;
    const image = isJpeg
      ? await pdf.embedJpg(imageBuffer)
      : await pdf.embedPng(imageBuffer);

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    const bytes = await pdf.save();
    return {
      buffer: Buffer.from(bytes),
      mimeType: 'application/pdf',
      extension: 'pdf',
      format: ExportFormat.PDF,
    };
  }
}
