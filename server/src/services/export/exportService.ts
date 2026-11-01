import { randomUUID } from 'crypto';
import {
  buildBiodataShareText,
  buildWhatsAppShareUrl,
  type ExportFormat,
  type ExportResult,
} from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import { createExportProvider } from '../../providers/export/createExportProvider';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { mediaKey } from '../../providers/storage/R2StorageProvider';
import { parseImageBase64 } from '../../utils/parseImageBase64';
import { assertExportAccess } from './assertExportAccess';
import { stampExportWatermark } from './stampExportWatermark';

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

export async function exportBiodata(input: {
  userId: string;
  format: ExportFormat;
  imageBase64: string;
  fileName?: string;
  personName?: string;
  designSlug?: string;
}): Promise<ExportResult> {
  const { hasPass } = await assertExportAccess({
    userId: input.userId,
    designSlug: input.designSlug,
  });

  let imageBuffer = parseImageBase64(input.imageBase64);
  if (!hasPass) {
    try {
      imageBuffer = await stampExportWatermark(imageBuffer);
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError(
        'Invalid or oversized export image',
        'EXPORT_IMAGE_INVALID',
      );
    }
  }

  const provider = createExportProvider(input.format);
  const artifact = await provider.create(imageBuffer);

  const baseName = sanitizeFileName(input.fileName ?? 'marriage-biodata');
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
    name: input.personName ?? baseName,
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
