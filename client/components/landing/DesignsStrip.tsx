'use client';

import Link from 'next/link';
import { VpThumb } from './VpThumb';
import { useDesignCatalog } from '@/features/designs/hooks/useDesignCatalog';

export function DesignsStrip() {
  const { activeGallery } = useDesignCatalog();

  return (
    <section className="sec" id="designs" aria-labelledby="des-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Designs</span>
          <h2 id="des-h">Designs for every family</h2>
          <p>
            Traditional, royal, floral or modern. Every thumbnail below is the real template,
            rendered live.
          </p>
        </div>
      </div>
      <div className="strip" tabIndex={0} aria-label="Biodata designs, scroll sideways">
        {activeGallery.map((t) => (
          <Link
            key={t.slug}
            className="strip-item"
            href={`/marriage-biodata-maker?design=${t.slug}`}
          >
            <VpThumb slug={t.slug} credit={t.tier === 'Free'} />
            <b>{t.name}</b>
            <span className={`badge ${t.tier === 'Free' ? 'free' : 'prem'}`}>{t.tier}</span>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Link className="btn btn-ghost" href="/templates">
          See all designs and filter
        </Link>
      </div>
    </section>
  );
}
