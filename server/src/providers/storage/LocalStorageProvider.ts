import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { StorageProvider, StoredFile } from './StorageProvider';
import { extensionForImageMime } from '../../utils/imageMagic';

export class LocalStorageProvider implements StorageProvider {
  constructor(
    private readonly uploadDir: string,
    private readonly publicBasePath: string,
  ) {}

  async upload(params: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<StoredFile> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const mime = params.mimeType as 'image/jpeg' | 'image/png' | 'image/webp';
    const ext = extensionForImageMime(mime);
    const key = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(this.uploadDir, key), params.buffer);
    return {
      key,
      url: `${this.publicBasePath}/${key}`,
      mimeType: params.mimeType,
      size: params.buffer.length,
    };
  }

  async delete(key: string): Promise<void> {
    if (!/^[a-zA-Z0-9._-]+$/.test(key) || key.includes('..')) {
      return;
    }
    try {
      await fs.unlink(path.join(this.uploadDir, key));
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: unknown }).code === 'ENOENT'
      ) {
        return;
      }
      throw error;
    }
  }
}

