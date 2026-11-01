import type { StorageProvider } from './StorageProvider';
import { R2StorageProvider } from './R2StorageProvider';

const provider = new R2StorageProvider();

export function createStorageProvider(): StorageProvider {
  return provider;
}
