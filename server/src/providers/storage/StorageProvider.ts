export type MediaAccess = 'public' | 'private';

export interface StoredFile {
  url: string;
  key: string;
  mimeType: string;
  size: number;
}

export interface StorageProvider {
  upload(params: {
    buffer: Buffer;
    mimeType: string;
    key: string;
    access: MediaAccess;
    cacheControl: string;
    contentDisposition?: string;
  }): Promise<StoredFile>;
  delete(key: string, access: MediaAccess): Promise<void>;
  signedUrl(
    key: string,
    opts?: { downloadName?: string; fromNow?: boolean },
  ): Promise<string>;
}
