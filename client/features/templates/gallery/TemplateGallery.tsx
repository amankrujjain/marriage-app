'use client';

import { useMemo, useState } from 'react';
import {
  FAITH_FILTERS,
  GALLERY_TEMPLATES,
  STYLE_FILTERS,
  type GalleryFaith,
  type GalleryStyle,
  type GalleryTemplate,
} from './galleryCatalog';
import { GalleryCard } from './GalleryCard';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { useReveal } from '@/components/landing/useReveal';

export function TemplateGallery() {
  const [cat, setCat] = useState<(typeof STYLE_FILTERS)[number]>('All');
  const [faiths, setFaiths] = useState<Partial<Record<GalleryFaith, boolean>>>({});
  const [preview, setPreview] = useState<GalleryTemplate | null>(null);

  useReveal();

  const filtered = useMemo(() => {
    return GALLERY_TEMPLATES.filter((t) => {
      const okCat = cat === 'All' || t.cat === (cat as GalleryStyle);
      const active = (Object.keys(faiths) as GalleryFaith[]).filter((f) => faiths[f]);
      const okFaith = active.every((f) => t.faith.includes(f));
      return okCat && okFaith;
    });
  }, [cat, faiths]);

  function reset() {
    setCat('All');
    setFaiths({});
  }

  return (
    <>
      <section className="page-head wrap">
        <h1>Marriage biodata designs</h1>
        <p>
          Pick a design, then add your details. Every card below shows a sample of the real layout.
        </p>
        <div className="pills" role="group" aria-label="Filter by style">
          {STYLE_FILTERS.map((s) => (
            <button
              key={s}
              className="pill"
              type="button"
              data-cat={s}
              aria-pressed={cat === s}
              onClick={() => {
                setCat(s);
                if (s === 'All') setFaiths({});
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="pills" role="group" aria-label="Filter by community" style={{ marginTop: 0 }}>
          {FAITH_FILTERS.map((f) => (
            <button
              key={f}
              className="pill"
              type="button"
              aria-pressed={!!faiths[f]}
              onClick={() => setFaiths((prev) => ({ ...prev, [f]: !prev[f] }))}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="result-count" role="status" aria-live="polite">
          Showing {filtered.length} of {GALLERY_TEMPLATES.length} designs
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 20 }}>
        <div className="tpl-grid">
          {filtered.map((t) => (
            <GalleryCard key={t.slug} template={t} onPreview={() => setPreview(t)} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>No design matches that mix yet</h3>
            <p>Try another style or community, or see everything.</p>
            <button className="btn btn-ghost" type="button" onClick={reset}>
              Show all designs
            </button>
          </div>
        ) : null}
      </section>

      <TemplatePreviewModal template={preview} onClose={() => setPreview(null)} />
    </>
  );
}
