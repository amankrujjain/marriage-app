import { ExportFormat } from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import type { ExportProvider } from './ExportProvider';
import { JpgExportProvider, PngExportProvider } from './ImageExportProvider';
import { PdfExportProvider } from './PdfExportProvider';

export function createExportProvider(format: ExportFormat): ExportProvider {
  switch (format) {
    case ExportFormat.PDF:
      return new PdfExportProvider();
    case ExportFormat.PNG:
      return new PngExportProvider();
    case ExportFormat.JPG:
      return new JpgExportProvider();
    default:
      throw new BadRequestError('Unsupported export format', 'EXPORT_FORMAT_INVALID');
  }
}
