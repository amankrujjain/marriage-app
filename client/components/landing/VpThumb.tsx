'use client';

import { useEffect, useRef } from 'react';
import { loadVp } from '@/lib/vp/loadVp';
import type { VpSample } from '@/lib/vp/types';

type SampleKind = 'short' | 'long' | 'male';

type VpThumbProps = {
  slug: string;
  sample?: SampleKind;
  credit?: boolean;
  className?: string;
  'aria-label'?: string;
};

const A4_PX_W = (210 * 96) / 25.4;

export function VpThumb({
  slug,
  sample = 'short',
  credit = false,
  className = '',
  'aria-label': ariaLabel,
}: VpThumbProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let alive = true;

    void loadVp().then((VP) => {
      if (!alive || !hostRef.current) return;
      const data: VpSample = VP.sampleFor
        ? VP.sampleFor(slug, sample)
        : sample === 'long'
          ? VP.sampleLong
          : sample === 'male'
            ? VP.sampleMale
            : VP.sampleShort;
      host.innerHTML = '';
      VP.thumb(host, data, slug, { credit });
      requestAnimationFrame(() => {
        const bd = host.firstElementChild as HTMLElement | null;
        if (bd?.classList.contains('bd')) {
          VP.fit(bd);
          bd.style.transform = `scale(${(host.clientWidth || 200) / A4_PX_W})`;
        }
      });
    });

    return () => {
      alive = false;
      if (host) host.innerHTML = '';
    };
  }, [slug, sample, credit]);

  return (
    <div
      ref={hostRef}
      className={`thumb ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
