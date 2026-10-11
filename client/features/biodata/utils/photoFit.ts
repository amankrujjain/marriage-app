import {
  DEFAULT_PROFILE_PHOTO_FIT,
  type ProfilePhotoFit,
} from '@marriage/shared';
import type { CSSProperties } from 'react';

export function resolvePhotoFit(fit?: ProfilePhotoFit | null): ProfilePhotoFit {
  if (!fit) return { ...DEFAULT_PROFILE_PHOTO_FIT };
  // Old default (y:28) clipped the crown inside oval frames — migrate quietly.
  if (fit.zoom === 1 && fit.x === 50 && fit.y === 28) {
    return { ...DEFAULT_PROFILE_PHOTO_FIT };
  }
  return fit;
}

/**
 * Frame photo in an overflow:hidden 4:5 box (matches template .bd-photo).
 *
 * zoom === 1: object-position pans inside a cover-fitted image (oval-safe).
 * zoom  > 1: enlarge the image and offset so the focal point stays centered.
 */
export function photoFitImgStyle(fit?: ProfilePhotoFit | null): CSSProperties {
  const f = resolvePhotoFit(fit);
  const z = f.zoom;

  if (z <= 1.001) {
    return {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: `${f.x}% ${f.y}%`,
      display: 'block',
    };
  }

  return {
    position: 'absolute',
    width: `${z * 100}%`,
    height: `${z * 100}%`,
    maxWidth: 'none',
    left: `${50 - f.x * z}%`,
    top: `${50 - f.y * z}%`,
    objectFit: 'cover',
    objectPosition: 'center center',
    display: 'block',
  };
}

/** Same framing as photoFitImgStyle, for biodata.js inline styles. */
export function photoFitVpAttr(fit?: ProfilePhotoFit | null): string {
  const f = resolvePhotoFit(fit);
  const z = f.zoom;
  if (z <= 1.001) {
    return (
      'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:' +
      f.x +
      '% ' +
      f.y +
      '%;display:block'
    );
  }
  const left = 50 - f.x * z;
  const top = 50 - f.y * z;
  return (
    'position:absolute;width:' +
    z * 100 +
    '%;height:' +
    z * 100 +
    '%;max-width:none;left:' +
    left +
    '%;top:' +
    top +
    '%;object-fit:cover;object-position:center;display:block'
  );
}

export function clampPhotoFit(partial: ProfilePhotoFit): ProfilePhotoFit {
  return {
    x: Math.min(100, Math.max(0, partial.x)),
    y: Math.min(100, Math.max(0, partial.y)),
    zoom: Math.min(2.5, Math.max(1, partial.zoom)),
  };
}
