import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { env } from '../../config/env';
import { AppError } from '../../errors/AppError';
import { logger } from '../../utils/logger';
import type {
  MediaAccess,
  StorageProvider,
  StoredFile,
  StoredObject,
} from './StorageProvider';

export const MEDIA_KEYS = {
  blogCover: 'blog/covers',
  blogInline: 'blog/inline',
  userPhotos: 'users/:userId/photos',
  userExports: 'exports/:userId',
  userInvoices: 'invoices/:userId',
  assetsLogos: 'assets/logos',
  assetsOg: 'assets/og',
  assetsMisc: 'assets/misc',
} as const;

const ALLOWED_EXTS = new Set(['webp', 'png', 'jpg', 'pdf', 'docx', 'svg']);
const USER_ID_RE = /^[0-9a-f]{24}$/;

export function mediaKey(
  kind: keyof typeof MEDIA_KEYS,
  ext: string,
  userId?: string,
): string {
  if (!ALLOWED_EXTS.has(ext)) {
    throw new Error(`Unsupported media extension: ${ext}`);
  }
  const template = MEDIA_KEYS[kind];
  if (template.includes(':userId')) {
    if (!userId || !USER_ID_RE.test(userId)) {
      throw new Error('A valid userId is required for this media key');
    }
  }
  const path = template.replace(':userId', userId ?? '');
  return `${env.R2_ROOT_PREFIX}/${path}/${randomUUID()}.${ext}`;
}

function isConfigured(): boolean {
  return Boolean(
    env.R2_ACCOUNT_ID &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_PUBLIC_BUCKET &&
      env.R2_PRIVATE_BUCKET &&
      env.R2_PUBLIC_BASE_URL,
  );
}

function throwUnavailable(): never {
  throw new AppError(
    'Media storage is not configured',
    503,
    'MEDIA_STORAGE_UNAVAILABLE',
  );
}

export function privateObjectUrl(key: string): string {
  return `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_PRIVATE_BUCKET}/${key}`;
}

export function publicObjectUrl(key: string): string {
  const base = (env.R2_PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
  return `${base}/${key}`;
}

let client: S3Client | null = null;

function ensureClient(): S3Client {
  if (!isConfigured()) throwUnavailable();
  if (client) return client;
  client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  return client;
}

function bucketFor(access: MediaAccess): string {
  return access === 'public' ? env.R2_PUBLIC_BUCKET! : env.R2_PRIVATE_BUCKET!;
}

export class R2StorageProvider implements StorageProvider {
  async upload(params: {
    buffer: Buffer;
    mimeType: string;
    key: string;
    access: MediaAccess;
    cacheControl: string;
    contentDisposition?: string;
  }): Promise<StoredFile> {
    const s3 = ensureClient();
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketFor(params.access),
          Key: params.key,
          Body: params.buffer,
          ContentType: params.mimeType,
          CacheControl: params.cacheControl,
          ContentDisposition: params.contentDisposition,
        }),
      );
    } catch (error) {
      logger.warn('R2 upload failed', {
        name: error instanceof Error ? error.name : 'unknown',
      });
      throw new AppError('Upload failed', 502, 'MEDIA_UPLOAD_FAILED');
    }

    return {
      url:
        params.access === 'public'
          ? publicObjectUrl(params.key)
          : privateObjectUrl(params.key),
      key: params.key,
      mimeType: params.mimeType,
      size: params.buffer.length,
    };
  }

  async delete(key: string, access: MediaAccess): Promise<void> {
    const s3 = ensureClient();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketFor(access),
        Key: key,
      }),
    );
  }

  async getObject(key: string, access: MediaAccess): Promise<StoredObject> {
    const s3 = ensureClient();
    try {
      const result = await s3.send(
        new GetObjectCommand({
          Bucket: bucketFor(access),
          Key: key,
        }),
      );
      const bytes = await result.Body?.transformToByteArray();
      if (!bytes) {
        throw new AppError('Media not found', 404, 'MEDIA_NOT_FOUND');
      }
      return {
        buffer: Buffer.from(bytes),
        mimeType: result.ContentType || 'application/octet-stream',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.warn('R2 getObject failed', {
        name: error instanceof Error ? error.name : 'unknown',
      });
      throw new AppError('Media not found', 404, 'MEDIA_NOT_FOUND');
    }
  }

  async signedUrl(
    key: string,
    opts?: { downloadName?: string; fromNow?: boolean },
  ): Promise<string> {
    const s3 = ensureClient();
    const signingDate = opts?.fromNow
      ? new Date()
      : new Date(
          Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
          ),
        );

    return getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: env.R2_PRIVATE_BUCKET!,
        Key: key,
        ResponseContentDisposition: opts?.downloadName
          ? `attachment; filename="${opts.downloadName}"`
          : undefined,
      }),
      { expiresIn: 604800, signingDate },
    );
  }
}
