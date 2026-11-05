import sharp, { type ResizeOptions } from 'sharp';

export type ImageOptimizePreset = 'profile' | 'blog' | 'og';

export interface OptimizedImage {
  buffer: Buffer;
  mimeType: 'image/webp';
  width: number;
  height: number;
}

const RESIZE: Record<ImageOptimizePreset, ResizeOptions> = {
  profile: {
    width: 1200,
    height: 1200,
    fit: 'inside',
    withoutEnlargement: true,
  },
  blog: { width: 1600, withoutEnlargement: true },
  og: { width: 1200, withoutEnlargement: true },
};

/** Single sharp pipeline for every user image upload; callers map failures to their own 400 code. */
export async function optimizeImage(
  buffer: Buffer,
  preset: ImageOptimizePreset,
): Promise<OptimizedImage> {
  const { data, info } = await sharp(buffer, { limitInputPixels: 40_000_000 })
    .autoOrient()
    .resize(RESIZE[preset])
    .webp({ quality: 80, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  return {
    buffer: data,
    mimeType: 'image/webp',
    width: info.width,
    height: info.height,
  };
}
