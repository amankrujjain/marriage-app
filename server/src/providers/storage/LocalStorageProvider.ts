import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { StorageProvider, StoredFile } from './StorageProvider';

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
    const ext = path.extname(params.originalName).toLowerCase() || '.jpg';
    const key = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(this.uploadDir, key), params.buffer);
    return {
      key,
      url: `${this.publicBasePath}/${key}`,
      mimeType: params.mimeType,
      size: params.buffer.length,
    };
  }
}
