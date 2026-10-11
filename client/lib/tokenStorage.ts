/**
 * Tokens are httpOnly cookies managed by the API.
 * These helpers only clear any legacy sessionStorage leftovers from older builds.
 */

const LEGACY_TOKEN_KEY = 'vivah_access_token';

export function clearLegacyAccessToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
}

/** @deprecated No-op — access token is an httpOnly cookie. */
export function getAccessToken(): string | null {
  return null;
}

/** @deprecated No-op — access token is an httpOnly cookie. */
export function setAccessToken(_token: string): void {
  /* cookies only */
}

/** Clears legacy storage only. */
export function clearAccessToken(): void {
  clearLegacyAccessToken();
}
