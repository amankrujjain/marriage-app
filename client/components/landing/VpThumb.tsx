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
    let painted = false;

    function paint(VP: Window['VP']): void {
      const el = hostRef.current;
      if (!alive || !el || painted) return;
      painted = true;
      const data: VpSample = VP.sampleFor
        ? VP.sampleFor(slug, sample)
        : sample === 'long'
          ? VP.sampleLong
          : sample === 'male'
            ? VP.sampleMale
            : VP.sampleShort;
      el.innerHTML = '';
      VP.thumb(el, data, slug, { credit });
      requestAnimationFrame(() => {
        const bd = el.firstElementChild as HTMLElement | null;
        if (bd?.classList.contains('bd')) {
          VP.fit(bd);
          bd.style.transform = `scale(${(el.clientWidth || 200) / A4_PX_W})`;
        }
      });
    }

    // Only render when the thumb is near the viewport (avoids freezing /).
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        void loadVp().then((VP) => {
          if (!alive) return;
          paint(VP);
        });
      },
      { rootMargin: '120px', threshold: 0.01 },
    );
    observer.observe(host);

    return () => {
      alive = false;
      observer.disconnect();
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
