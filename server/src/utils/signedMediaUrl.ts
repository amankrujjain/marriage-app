import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '../config/env';

/** Legacy export links only (HMAC). Photos and blog images use R2. */
export type MediaKind = 'exports';

const SAFE_FILE = /^[a-zA-Z0-9._-]+$/;

export function isSafeMediaFileName(fileName: string): boolean {
  return SAFE_FILE.test(fileName) && !fileName.includes('..');
}

function signPayload(kind: MediaKind, fileName: string, exp: number): string {
  return createHmac('sha256', env.JWT_SECRET)
    .update(`${kind}/${fileName}:${exp}`)
    .digest('hex');
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
