import { BadRequestError } from '../../errors/BadRequestError';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { detectImageMime } from '../../utils/imageMagic';
import { buildSignedMediaUrl, mediaCanonicalPath } from '../../utils/signedMediaUrl';

const PHOTO_URL_TTL_SEC = 7 * 24 * 60 * 60;

export async function uploadPhotoService(file?: Express.Multer.File): Promise<{
  url: string;
  key: string;
  canonicalUrl: string;
}> {
  if (!file) {
    throw new BadRequestError('Photo file is required', 'PHOTO_REQUIRED');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new BadRequestError('Photo must be under 2MB', 'PHOTO_TOO_LARGE');
  }

  const detected = detectImageMime(file.buffer);
  if (!detected) {
    throw new BadRequestError('Only JPEG, PNG, or WebP allowed', 'PHOTO_TYPE_INVALID');
  }

  const storage = createStorageProvider();
  const stored = await storage.upload({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: detected,
  });

  const signed = buildSignedMediaUrl({
    kind: 'photos',
    fileName: stored.key,
    ttlSec: PHOTO_URL_TTL_SEC,
  });

  return {
    url: signed,
    key: stored.key,
    canonicalUrl: mediaCanonicalPath('photos', stored.key),
  };
}
