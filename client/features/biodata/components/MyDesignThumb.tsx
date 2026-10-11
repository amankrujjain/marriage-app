'use client';

import { useEffect, useRef } from 'react';
import type { BiodataContent } from '@marriage/shared';
import { loadVp } from '@/lib/vp/loadVp';
import { mapBiodataToVp } from './editor/mapBiodataToVp';
import { isFreeDesign } from './editor/designMap';

const A4_PX_W = (210 * 96) / 25.4;

type MyDesignThumbProps = {
  content: BiodataContent;
  slug?: string;
};

export function MyDesignThumb({ content, slug = 'zari-traditional' }: MyDesignThumbProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let alive = true;
    const data = mapBiodataToVp(content);

    void loadVp().then((VP) => {
      if (!alive || !hostRef.current) return;
      host.innerHTML = '';
      VP.thumb(host, data, slug, { credit: isFreeDesign(slug) });
      requestAnimationFrame(() => {
        const bd = host.firstElementChild as HTMLElement | null;
        if (!bd?.classList.contains('bd')) return;
        VP.fit(bd);
        bd.style.transform = `scale(${(host.clientWidth || 200) / A4_PX_W})`;
      });
    });

    return () => {
      alive = false;
      if (host) host.innerHTML = '';
    };
  }, [content, slug]);

  return <div ref={hostRef} className="thumb" />;
}
