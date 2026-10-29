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
import { findActiveDesignTierBySlug } from '../designs/designTemplateService';
import { parseImageBase64 } from '../../utils/parseImageBase64';
import { buildSignedMediaUrl } from '../../utils/signedMediaUrl';
import { isPremium } from '../../utils/isPremium';
import { requirePremiumUser } from './requirePremiumUser';
import { stampExportWatermark } from './stampExportWatermark';
import { findUserById } from '../../repositories/userRepository';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

const EXPORT_URL_TTL_SEC = 7 * 24 * 60 * 60;

/** Must match signed-media SAFE_FILE: [a-zA-Z0-9._-]+ (no spaces). */
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
  const slug = input.designSlug?.trim();
  const tier = slug ? await findActiveDesignTierBySlug(slug) : null;

  let hasPass = false;
  if (tier !== 'Free') {
    await requirePremiumUser(input.userId);
    hasPass = true;
  } else {
    const user = await findUserById(input.userId);
    if (!user) {
      throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
    }
    hasPass = isPremium(user.premiumUntil);
  }

  let imageBuffer = parseImageBase64(input.imageBase64);
  // No active Pass → stamp watermark (closes Free-slug + Premium-render bypass).
  if (!hasPass) {
    imageBuffer = await stampExportWatermark(imageBuffer);
  }

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
