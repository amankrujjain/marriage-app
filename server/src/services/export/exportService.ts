import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  buildBiodataShareText,
  buildWhatsAppShareUrl,
  type ExportFormat,
  type ExportResult,
} from '@marriage/shared';
import { createExportProvider } from '../../providers/export/createExportProvider';
import { parseImageBase64 } from '../../utils/parseImageBase64';
import { buildSignedMediaUrl } from '../../utils/signedMediaUrl';
import { requirePremiumUser } from './requirePremiumUser';

const EXPORT_URL_TTL_SEC = 7 * 24 * 60 * 60;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_ ]/g, '').trim().slice(0, 60) || 'biodata';
}

export async function exportBiodata(input: {
  userId: string;
  format: ExportFormat;
  imageBase64: string;
  fileName?: string;
  personName?: string;
}): Promise<ExportResult> {
  await requirePremiumUser(input.userId);

  const imageBuffer = parseImageBase64(input.imageBase64);
  const provider = createExportProvider(input.format);
  const artifact = await provider.create(imageBuffer);

  const baseName = sanitizeFileName(input.fileName ?? 'marriage-biodata');
  const fileName = `${baseName}-${randomUUID().slice(0, 8)}.${artifact.extension}`;
  const dir = path.resolve(process.cwd(), 'uploads', 'exports');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), artifact.buffer);

  const url = buildSignedMediaUrl({
    kind: 'exports',
    fileName,
    ttlSec: EXPORT_URL_TTL_SEC,
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
