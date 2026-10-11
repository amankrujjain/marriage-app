import path from 'path';
import type { StorageProvider } from './StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';

/**
 * Local disk today; swap implementation when STORAGE_PROVIDER=s3 later.
 * Public path is the auth/signed media route (not a world-readable static tree).
 */
export function createStorageProvider(): StorageProvider {
  return new LocalStorageProvider(
    path.resolve(process.cwd(), 'uploads', 'photos'),
    '/api/v1/media/photos',
  );
}
