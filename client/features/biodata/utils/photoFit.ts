import {
  DEFAULT_PROFILE_PHOTO_FIT,
  type ProfilePhotoFit,
} from '@marriage/shared';
import type { CSSProperties } from 'react';

export function resolvePhotoFit(fit?: ProfilePhotoFit | null): ProfilePhotoFit {
  return fit ?? DEFAULT_PROFILE_PHOTO_FIT;
}

/** Inline styles for an <img> inside an overflow:hidden 3:4 frame. */
export function photoFitImgStyle(fit?: ProfilePhotoFit | null): CSSProperties {
  const f = resolvePhotoFit(fit);
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${f.x}% ${f.y}%`,
    transform: f.zoom !== 1 ? `scale(${f.zoom})` : undefined,
    transformOrigin: `${f.x}% ${f.y}%`,
    display: 'block',
  };
}

export function clampPhotoFit(partial: ProfilePhotoFit): ProfilePhotoFit {
  return {
    x: Math.min(100, Math.max(0, partial.x)),
    y: Math.min(100, Math.max(0, partial.y)),
    zoom: Math.min(2.5, Math.max(1, partial.zoom)),
  };
}
