import sharp from 'sharp';

const MARK = 'marriagebio.in';

/**
 * Small bottom-right watermark for free (no Wedding Pass) exports.
 * Uses sharp defaults (including limitInputPixels). Callers map sharp failures to 400.
 */
export async function stampExportWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width ?? 800;
  const fontSize = Math.max(14, Math.round(width * 0.022));
  const pad = Math.round(fontSize * 0.8);
  const svgWidth = Math.round(fontSize * MARK.length * 0.62 + pad * 2);
  const svgHeight = Math.round(fontSize * 1.6 + pad);

  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">` +
      `<rect width="100%" height="100%" rx="4" fill="rgba(255,255,255,0.55)"/>` +
      `<text x="${pad}" y="${Math.round(fontSize * 1.15)}" ` +
      `font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" ` +
      `fill="rgba(40,16,20,0.55)">${MARK}</text></svg>`,
  );

  return sharp(imageBuffer)
    .composite([{ input: svg, gravity: 'southeast' }])
    .toBuffer();
}
