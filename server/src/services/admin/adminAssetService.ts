import { BadRequestError } from '../../errors/BadRequestError';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { mediaKey } from '../../providers/storage/R2StorageProvider';
import { detectImageMime, detectSvgMime } from '../../utils/imageMagic';
import { optimizeImage } from '../../utils/optimizeImage';

export type AdminAssetKind = 'logos' | 'og' | 'misc';

const KINDS = new Set<AdminAssetKind>(['logos', 'og', 'misc']);

const MEDIA_KIND = {
  logos: 'assetsLogos',
  og: 'assetsOg',
  misc: 'assetsMisc',
} as const;

export async function uploadAdminAssetService(input: {
  file?: Express.Multer.File;
  kind: unknown;
}): Promise<{
  url: string;
  key: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  kind: AdminAssetKind;
}> {
  if (!input.file) {
    throw new BadRequestError('Asset file is required', 'ASSET_REQUIRED');
  }

  const kindRaw = typeof input.kind === 'string' ? input.kind.trim() : '';
  if (!KINDS.has(kindRaw as AdminAssetKind)) {
    throw new BadRequestError(
      'kind must be logos, og, or misc',
      'ASSET_KIND_INVALID',
    );
  }
  const kind = kindRaw as AdminAssetKind;
  const file = input.file;

  const svgMime = detectSvgMime(file.buffer);
  const rasterMime = detectImageMime(file.buffer);

  let buffer: Buffer;
  let mimeType: string;
  let ext: string;
  let width: number | undefined;
  let height: number | undefined;

  if (kind === 'logos') {
    if (svgMime) {
      buffer = file.buffer;
      mimeType = 'image/svg+xml';
      ext = 'svg';
    } else if (rasterMime === 'image/png') {
      buffer = file.buffer;
      mimeType = 'image/png';
      ext = 'png';
    } else if (rasterMime === 'image/jpeg' || rasterMime === 'image/webp') {
      try {
        const optimized = await optimizeImage(file.buffer, 'og');
        buffer = optimized.buffer;
        mimeType = optimized.mimeType;
        ext = 'webp';
        width = optimized.width;
        height = optimized.height;
      } catch {
        throw new BadRequestError('Asset could not be processed', 'ASSET_INVALID');
      }
    } else {
      throw new BadRequestError(
        'Only JPEG, PNG, WebP, or SVG allowed',
        'ASSET_TYPE_INVALID',
      );
    }
  } else {
    if (svgMime) {
      throw new BadRequestError(
        'SVG is only allowed for logos',
        'ASSET_TYPE_INVALID',
      );
    }
    if (!rasterMime) {
      throw new BadRequestError(
        'Only JPEG, PNG, or WebP allowed',
        'ASSET_TYPE_INVALID',
      );
    }
    try {
      const optimized = await optimizeImage(file.buffer, 'og');
      buffer = optimized.buffer;
      mimeType = optimized.mimeType;
      ext = 'webp';
      width = optimized.width;
      height = optimized.height;
    } catch {
      throw new BadRequestError('Asset could not be processed', 'ASSET_INVALID');
    }
  }

  const stored = await createStorageProvider().upload({
    buffer,
    mimeType,
    key: mediaKey(MEDIA_KIND[kind], ext),
    access: 'public',
    cacheControl: 'public, max-age=31536000, immutable',
  });

  return {
    url: stored.url,
    key: stored.key,
    mimeType: stored.mimeType,
    size: stored.size,
    width,
    height,
    kind,
  };
}
