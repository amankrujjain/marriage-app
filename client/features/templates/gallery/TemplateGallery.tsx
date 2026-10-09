'use client';

import { useMemo, useState } from 'react';
import {
  COMMUNITY_FILTERS,
  GALLERY_TEMPLATES,
  LAYOUT_FILTERS,
  STYLE_FILTERS,
  type GalleryCommunity,
  type GalleryPages,
  type GalleryStyle,
} from './galleryCatalog';
import { GalleryCard } from './GalleryCard';

type StyleSel = (typeof STYLE_FILTERS)[number];
type CommSel = (typeof COMMUNITY_FILTERS)[number];
type LayoutSel = (typeof LAYOUT_FILTERS)[number];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`gallery-chip ${active ? 'is-active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function FilterRow({
  label,
  children,
  trailing,
}: {
  label: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="gallery-filter-row">
      <span className="gallery-filter-label">{label}</span>
      {children}
      {trailing}
    </div>
  );
}

export function TemplateGallery() {
  const [style, setStyle] = useState<StyleSel>('All');
  const [comm, setComm] = useState<CommSel>('All');
  const [layout, setLayout] = useState<LayoutSel>('All');

  const filtered = useMemo(() => {
    return GALLERY_TEMPLATES.filter((t) => {
      const styleOk = style === 'All' || t.style === (style as GalleryStyle);
      const commOk =
        comm === 'All' || t.communities.includes(comm as GalleryCommunity);
      const layoutOk =
        layout === 'All' ||
        (layout === 'Without photo'
          ? !t.hasPhoto
          : t.pages === (layout as GalleryPages));
      return styleOk && commOk && layoutOk;
    });
  }, [style, comm, layout]);

  const countLabel =
    filtered.length === 1 ? '1 design' : `${filtered.length} designs`;

  return (
    <main className="gallery">
      <div className="gallery-intro">
        <h1>Marriage biodata designs</h1>
        <p>
          Every design is A4, works with or without a photo, and shows your own
          details once you&apos;ve filled the form.
        </p>
      </div>

      <div className="gallery-filters">
        <FilterRow label="Style">
          {STYLE_FILTERS.map((val) => (
            <FilterChip
              key={val}
              label={val}
              active={style === val}
              onClick={() => setStyle(val)}
            />
          ))}
        </FilterRow>
        <FilterRow label="Community">
          {COMMUNITY_FILTERS.map((val) => (
            <FilterChip
              key={val}
              label={val}
              active={comm === val}
              onClick={() => setComm(val)}
            />
          ))}
        </FilterRow>
        <FilterRow
          label="Layout"
          trailing={<span className="gallery-count">{countLabel}</span>}
        >
          {LAYOUT_FILTERS.map((val) => (
            <FilterChip
              key={val}
              label={val}
              active={layout === val}
              onClick={() => setLayout(val)}
            />
          ))}
        </FilterRow>
      </div>

      <div className="gallery-grid">
        {filtered.map((template) => (
          <GalleryCard key={template.id} template={template} />
        ))}
      </div>
    </main>
  );
}
