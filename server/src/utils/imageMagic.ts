/** Detect SVG MIME from text start (BOM stripped; first 256 bytes). */
export function detectSvgMime(buffer: Buffer): 'image/svg+xml' | null {
  let start = 0;
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    start = 3;
  }
  const head = buffer
    .subarray(start, Math.min(buffer.length, start + 256))
    .toString('utf8')
    .trimStart()
    .toLowerCase();
  if (head.startsWith('<svg')) return 'image/svg+xml';
  if (head.startsWith('<?xml') && head.includes('<svg')) return 'image/svg+xml';
  return null;
}

/** Detect image MIME from magic bytes (do not trust client Content-Type). */
export function detectImageMime(
  buffer: Buffer,
): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export function extensionForImageMime(
  mime: 'image/jpeg' | 'image/png' | 'image/webp',
): '.jpg' | '.png' | '.webp' {
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  return '.jpg';
}
