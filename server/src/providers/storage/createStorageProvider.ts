import path from 'path';
import type { StorageProvider } from './StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';

export function createStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? 'local';
  if (provider !== 'local') {
    // S3 / cloud providers plug in here in later phases.
    return new LocalStorageProvider(
      path.resolve(process.cwd(), 'uploads'),
      '/uploads',
    );
  }
  return new LocalStorageProvider(path.resolve(process.cwd(), 'uploads'), '/uploads');
}
