import { env } from '../config/env';

function serverHost(): string {
  const base = process.env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`;
  try {
    return new URL(base).host;
  } catch {
    return `localhost:${env.PORT}`;
  }
}

function publicBase(): string {
  return (process.env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`).replace(/\/$/, '');
}

/** Allow data URLs, our media paths, and legacy /uploads on our host only. */
export function isAllowedProfilePhotoUrl(value: string): boolean {
  if (!value) return true;
  if (
    value.startsWith('data:image/jpeg') ||
    value.startsWith('data:image/png') ||
    value.startsWith('data:image/webp')
  ) {
    return value.length <= 2_500_000;
  }

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

/** Persist media URLs without expiring signatures. */
export function canonicalizeProfilePhotoUrl(value: string | undefined): string | undefined {
  if (!value) return value;
  if (value.startsWith('data:image/')) return value;

  try {
    if (value.startsWith('/')) {
      return value.split('?')[0];
    }
    const u = new URL(value);
    if (u.host !== serverHost()) return value;
    if (
      u.pathname.startsWith('/api/v1/media/photos/') ||
      u.pathname.startsWith('/uploads/')
    ) {
      return `${publicBase()}${u.pathname}`;
    }
  } catch {
    return value;
  }
  return value;
}
