import sharp from 'sharp';
import { BadRequestError } from '../../errors/BadRequestError';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { mediaKey } from '../../providers/storage/R2StorageProvider';
import { detectImageMime } from '../../utils/imageMagic';
import { logger } from '../../utils/logger';
import { parseProfilePhotoKey } from '../../utils/profilePhotoUrlRule';


export async function processProfilePhoto(buffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(buffer, { limitInputPixels: 40_000_000 })
      .autoOrient()
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new BadRequestError('Photo could not be processed', 'PHOTO_INVALID');
  }
}

export async function uploadPhotoService(
  userId: string,
  file?: Express.Multer.File,
): Promise<{
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
    throw new BadRequestError(
      'Only JPEG, PNG, or WebP allowed',
      'PHOTO_TYPE_INVALID',
    );
  }

  const processed = await processProfilePhoto(file.buffer);
  const provider = createStorageProvider();
  const key = mediaKey('userPhotos', 'webp', userId);
  const stored = await provider.upload({
    buffer: processed,
    mimeType: 'image/webp',
    key,
    access: 'private',
    cacheControl: 'private, max-age=86400',
  });

  return {
    url: await provider.signedUrl(stored.key),
    key: stored.key,
    canonicalUrl: stored.url,
  };
}

export async function deleteProfilePhotoQuietly(
  value: string | undefined,
): Promise<void> {
  const key = parseProfilePhotoKey(value);
  if (!key) return;
  try {
    await createStorageProvider().delete(key, 'private');
  } catch (error) {
    logger.warn('Profile photo delete failed', {
      key,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
