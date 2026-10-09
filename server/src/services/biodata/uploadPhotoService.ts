import { BadRequestError } from '../../errors/BadRequestError';
import { env } from '../../config/env';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadPhotoService(file?: Express.Multer.File): Promise<{
  url: string;
  key: string;
}> {
  if (!file) {
    throw new BadRequestError('Photo file is required', 'PHOTO_REQUIRED');
  }
  if (!ALLOWED.has(file.mimetype)) {
    throw new BadRequestError('Only JPEG, PNG, or WebP allowed', 'PHOTO_TYPE_INVALID');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new BadRequestError('Photo must be under 2MB', 'PHOTO_TOO_LARGE');
  }

  const storage = createStorageProvider();
  const stored = await storage.upload({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
  });
  const base = process.env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`;
  const url = stored.url.startsWith('http') ? stored.url : `${base}${stored.url}`;
  return { url, key: stored.key };
}
