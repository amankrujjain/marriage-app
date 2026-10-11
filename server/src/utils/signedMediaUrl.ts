import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '../config/env';

export type MediaKind = 'photos' | 'exports';

const SAFE_FILE = /^[a-zA-Z0-9._-]+$/;

export function isSafeMediaFileName(fileName: string): boolean {
  return SAFE_FILE.test(fileName) && !fileName.includes('..');
}

function publicBase(): string {
  return (process.env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`).replace(/\/$/, '');
}

function signPayload(kind: MediaKind, fileName: string, exp: number): string {
  return createHmac('sha256', env.JWT_SECRET)
    .update(`${kind}/${fileName}:${exp}`)
    .digest('hex');
}

export function buildSignedMediaUrl(input: {
  kind: MediaKind;
  fileName: string;
  /** Seconds until expiry */
  ttlSec: number;
}): string {
  if (!isSafeMediaFileName(input.fileName)) {
    throw new Error('Unsafe media file name');
  }
  const exp = Math.floor(Date.now() / 1000) + input.ttlSec;
  const sig = signPayload(input.kind, input.fileName, exp);
  const path = `/api/v1/media/${input.kind}/${encodeURIComponent(input.fileName)}`;
  return `${publicBase()}${path}?exp=${exp}&sig=${sig}`;
}

export function mediaCanonicalPath(kind: MediaKind, fileName: string): string {
  return `/api/v1/media/${kind}/${fileName}`;
}

/** Verify query signature for a media object. */
export function verifyMediaSignature(input: {
  kind: MediaKind;
  fileName: string;
  exp: string | undefined;
  sig: string | undefined;
}): boolean {
  if (!input.exp || !input.sig || !isSafeMediaFileName(input.fileName)) return false;
  const expNum = Number(input.exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) return false;
  if (!/^[a-f0-9]{64}$/i.test(input.sig)) return false;
  const expected = signPayload(input.kind, input.fileName, expNum);
  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(input.sig.toLowerCase(), 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * If url points at our media (or legacy /uploads), return a freshly signed URL.
 * data: and unknown hosts are returned unchanged / empty for unknown remote.
 */
export function resignMediaUrlIfNeeded(
  url: string | undefined,
  ttlSec: number,
): string | undefined {
  if (!url) return url;
  if (url.startsWith('data:image/')) return url;

  let pathname: string;
  try {
    if (url.startsWith('/')) {
      pathname = url.split('?')[0] ?? url;
    } else {
      const parsed = new URL(url);
      const base = new URL(publicBase());
      if (parsed.host !== base.host) return url;
      pathname = parsed.pathname;
    }
  } catch {
    return url;
  }

  const mediaMatch = /^\/api\/v1\/media\/(photos|exports)\/([^/]+)$/.exec(pathname);
  if (mediaMatch) {
    return buildSignedMediaUrl({
      kind: mediaMatch[1] as MediaKind,
      fileName: decodeURIComponent(mediaMatch[2]!),
      ttlSec,
    });
  }

  const legacyPhoto = /^\/uploads\/(?!exports\/)([^/]+)$/.exec(pathname);
  if (legacyPhoto) {
    return buildSignedMediaUrl({
      kind: 'photos',
      fileName: decodeURIComponent(legacyPhoto[1]!),
      ttlSec,
    });
  }

  const legacyExport = /^\/uploads\/exports\/([^/]+)$/.exec(pathname);
  if (legacyExport) {
    return buildSignedMediaUrl({
      kind: 'exports',
      fileName: decodeURIComponent(legacyExport[1]!),
      ttlSec,
    });
  }

  return url;
}
