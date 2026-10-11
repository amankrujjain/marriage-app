/** Allow only same-origin relative app paths after login. */
export function safeNextPath(raw: string | null, fallback = '/account'): string {
  if (!raw) return fallback;
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return fallback;
  }
  if (raw.includes('\\') || raw.includes('://')) return fallback;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith('//') || decoded.includes('\\') || decoded.includes('://')) {
      return fallback;
    }
  } catch {
    return fallback;
  }
  return raw;
}
