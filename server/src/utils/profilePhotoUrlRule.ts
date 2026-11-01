import { env } from '../config/env';
import { BadRequestError } from '../errors/BadRequestError';
import { createStorageProvider } from '../providers/storage/createStorageProvider';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serverHost(): string {
  const base = process.env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`;
  try {
    return new URL(base).host;
  } catch {
    return `localhost:${env.PORT}`;
  }
}

function photoUrlPattern(): RegExp | null {
  if (!env.R2_ACCOUNT_ID || !env.R2_PRIVATE_BUCKET || !env.R2_ROOT_PREFIX) {
    return null;
  }
  return new RegExp(
    `^https://${escapeRegExp(env.R2_ACCOUNT_ID)}\\.r2\\.cloudflarestorage\\.com/${escapeRegExp(env.R2_PRIVATE_BUCKET)}/(${escapeRegExp(env.R2_ROOT_PREFIX)}/users/([0-9a-f]{24})/photos/[0-9a-f-]{36}\\.webp)$`,
  );
}

function isLegacyLocalPhotoUrl(value: string): boolean {
  const pathOnly = value.split('?')[0] ?? value;
  if (pathOnly.startsWith('/api/v1/media/photos/') || pathOnly.startsWith('/uploads/')) {
    return !pathOnly.includes('..');
  }

  try {
    const u = new URL(value);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (u.host !== serverHost()) return false;
    return (
      u.pathname.startsWith('/api/v1/media/photos/') ||
      u.pathname.startsWith('/uploads/')
    );
  } catch {
    return false;
  }
}

/** Allow data URLs, R2 private photo URLs, and legacy local photo URLs during migration. */
export function isAllowedProfilePhotoUrl(value: string): boolean {
  if (!value) return true;
  if (
    value.startsWith('data:image/jpeg') ||
    value.startsWith('data:image/png') ||
    value.startsWith('data:image/webp')
  ) {
    return value.length <= 2_500_000;
  }

  const withoutQuery = value.split('?')[0] ?? value;
  const pattern = photoUrlPattern();
  if (pattern?.test(withoutQuery)) return true;
  return isLegacyLocalPhotoUrl(value);
}

/**
 * Persist media URLs without expiring signatures.
 * Returns undefined for legacy local URLs so callers can drop or keep the prior value.
 */
export function canonicalizeProfilePhotoUrl(
  value: string | undefined,
  userId: string,
): string | undefined {
  if (!value) return value;
  if (value.startsWith('data:image/')) return value;

  const withoutQuery = value.split('?')[0] ?? value;
  const pattern = photoUrlPattern();
  const match = pattern?.exec(withoutQuery);
  if (match) {
    const ownerId = match[2];
    if (ownerId !== userId) {
      throw new BadRequestError('Invalid photo', 'PHOTO_URL_INVALID');
    }
    return withoutQuery;
  }

  if (isLegacyLocalPhotoUrl(value)) {
    return undefined;
  }

  return value;
}

export function parseProfilePhotoKey(value: string | undefined): string | null {
  if (!value) return null;
  const withoutQuery = value.split('?')[0] ?? value;
  const pattern = photoUrlPattern();
  const match = pattern?.exec(withoutQuery);
  return match?.[1] ?? null;
}

export async function signProfilePhotoUrl(value: string): Promise<string> {
  const key = parseProfilePhotoKey(value);
  if (!key) return value;
  try {
    return await createStorageProvider().signedUrl(key);
  } catch {
    return value;
  }
}
