/**
 * Upload MarriageBio brand pack assets to public R2.
 * From server/: npx tsx scripts/upload-brand-assets.ts
 */
import fs from 'fs/promises';
import path from 'path';
import { createStorageProvider } from '../src/providers/storage/createStorageProvider';
import { mediaKey } from '../src/providers/storage/R2StorageProvider';
import { detectImageMime, detectSvgMime } from '../src/utils/imageMagic';
import { optimizeImage } from '../src/utils/optimizeImage';

const packRoot = path.resolve(
  process.env.BRAND_PACK_DIR ??
    'C:/Users/ASUS/Downloads/marriagebio-logo-final/marriagebio-logo-final',
);

type Job = {
  label: string;
  file: string;
  kind: 'assetsLogos' | 'assetsOg' | 'assetsMisc';
  /** Keep SVG/PNG raw for logos; OG/misc raster → webp. */
  mode: 'raw-svg' | 'raw-png' | 'optimize-og';
};

const jobs: Job[] = [
  {
    label: 'seal-light',
    file: 'lockups/seal/marriagebio-seal-light.svg',
    kind: 'assetsLogos',
    mode: 'raw-svg',
  },
  {
    label: 'seal-dark',
    file: 'lockups/seal/marriagebio-seal-dark.svg',
    kind: 'assetsLogos',
    mode: 'raw-svg',
  },
  {
    label: 'logo-horizontal-light',
    file: 'lockups/horizontal-notagline/marriagebio-horizontal-notagline-light.svg',
    kind: 'assetsLogos',
    mode: 'raw-svg',
  },
  {
    label: 'logo-horizontal-dark',
    file: 'lockups/horizontal-notagline/marriagebio-horizontal-notagline-dark.svg',
    kind: 'assetsLogos',
    mode: 'raw-svg',
  },
  {
    label: 'og-image',
    file: 'social/og-image.png',
    kind: 'assetsOg',
    mode: 'optimize-og',
  },
  {
    label: 'profile-1080',
    file: 'social/profile-1080.png',
    kind: 'assetsMisc',
    mode: 'optimize-og',
  },
];

async function main(): Promise<void> {
  const provider = createStorageProvider();
  const results: Array<{ label: string; url: string; key: string }> = [];

  for (const job of jobs) {
    const abs = path.join(packRoot, job.file);
    const buffer = await fs.readFile(abs);

    let outBuf = buffer;
    let mimeType = 'application/octet-stream';
    let ext = 'bin';

    if (job.mode === 'raw-svg') {
      if (!detectSvgMime(buffer)) {
        throw new Error(`${job.label}: not SVG`);
      }
      mimeType = 'image/svg+xml';
      ext = 'svg';
    } else if (job.mode === 'raw-png') {
      if (detectImageMime(buffer) !== 'image/png') {
        throw new Error(`${job.label}: not PNG`);
      }
      mimeType = 'image/png';
      ext = 'png';
    } else {
      const optimized = await optimizeImage(buffer, 'og');
      outBuf = optimized.buffer;
      mimeType = optimized.mimeType;
      ext = 'webp';
    }

    const key = mediaKey(job.kind, ext);
    const stored = await provider.upload({
      buffer: outBuf,
      mimeType,
      key,
      access: 'public',
      cacheControl: 'public, max-age=31536000, immutable',
    });

    results.push({ label: job.label, url: stored.url, key: stored.key });
    console.log(`${job.label}\t${stored.url}`);
  }

  console.log('\n--- JSON ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
