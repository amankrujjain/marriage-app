'use client';

import { useEffect, useRef } from 'react';
import { loadVp } from '@/lib/vp/loadVp';

const A4_PX_W = (210 * 96) / 25.4;

/** Blank design thumbnail for mega/drawer shortcuts. */
export function MegaDesignThumb({ slug }: { slug: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let alive = true;

    void loadVp().then((VP) => {
      if (!alive || !hostRef.current) return;
      host.innerHTML = '';
      const sample = VP.sampleFor ? VP.sampleFor(slug, 'short') : VP.sampleShort;
      VP.thumb(host, sample, slug, { credit: false });
      requestAnimationFrame(() => {
        const bd = host.firstElementChild as HTMLElement | null;
        if (!bd?.classList.contains('bd')) return;
        VP.fit(bd);
        bd.style.transform = `scale(${(host.clientWidth || 66) / A4_PX_W})`;
      });
    });

    return () => {
      alive = false;
      if (host) host.innerHTML = '';
    };
  }, [slug]);

  return (
    <div
      ref={hostRef}
      className="mega-thumb"
      role="img"
      aria-label={`${slug} design preview`}
    />
  );
}
