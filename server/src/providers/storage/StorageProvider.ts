export interface StoredFile {
  url: string;
  key: string;
  mimeType: string;
  size: number;
}

export interface StorageProvider {
  upload(params: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<StoredFile>;
  delete?(key: string): Promise<void>;
}
