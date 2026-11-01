import { randomUUID } from 'crypto';
import {
  buildBiodataShareText,
  buildWhatsAppShareUrl,
  ExportFormat,
  type BiodataContent,
  type ExportResult,
} from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import { createDocx } from '../../providers/export/DocxExportProvider';
import { createTextPdf } from '../../providers/export/TextPdfExportProvider';
import type { DocumentExtraSection } from '../../providers/export/buildBiodataPlainSections';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { mediaKey } from '../../providers/storage/R2StorageProvider';
import { assertExportAccess } from './assertExportAccess';

/** Friendly download name (no spaces); used for Content-Disposition. */
function sanitizeFileName(name: string): string {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return cleaned || 'biodata';
}

export async function exportBiodataDocument(input: {
  userId: string;
  format: ExportFormat.PDF | ExportFormat.DOCX;
  content: BiodataContent;
  fileName?: string;
  personName?: string;
  designSlug?: string;
  extraSections?: DocumentExtraSection[];
}): Promise<ExportResult> {
  const { hasPass } = await assertExportAccess({
    userId: input.userId,
    designSlug: input.designSlug,
  });

  const title =
    input.personName?.trim() ||
    input.content.personal?.fullName?.trim() ||
    'Marriage biodata';

  const artifact =
    input.format === ExportFormat.DOCX
      ? await createDocx({
          content: input.content,
          title,
          watermark: !hasPass,
          extraSections: input.extraSections,
        })
      : input.format === ExportFormat.PDF
        ? await createTextPdf({
            content: input.content,
            title,
            watermark: !hasPass,
            extraSections: input.extraSections,
          })
        : (() => {
            throw new BadRequestError(
              'Unsupported document format',
              'EXPORT_FORMAT_INVALID',
            );
          })();

  const baseName = sanitizeFileName(input.fileName ?? title);
  const fileName = `${baseName}-${randomUUID().slice(0, 8)}.${artifact.extension}`;
  const storage = createStorageProvider();
  const stored = await storage.upload({
    buffer: artifact.buffer,
    mimeType: artifact.mimeType,
    key: mediaKey('userExports', artifact.extension, input.userId),
    access: 'private',
    cacheControl: 'private, no-store',
    contentDisposition: `attachment; filename="${fileName}"`,
  });
  const url = await storage.signedUrl(stored.key, {
    downloadName: fileName,
    fromNow: true,
  });
  const shareText = buildBiodataShareText({
    name: title,
    downloadUrl: url,
  });

  return {
    url,
    format: artifact.format,
    fileName,
    shareText,
    whatsappUrl: buildWhatsAppShareUrl(shareText),
  };
}
