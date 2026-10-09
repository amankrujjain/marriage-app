import Link from 'next/link';
import type { GalleryTemplate } from './galleryCatalog';

const LINE_WIDTHS = ['90%', '78%', '86%', '70%', '82%'] as const;

export function GalleryCard({ template }: { template: GalleryTemplate }) {
  return (
    <Link
      href={`/marriage-biodata-maker?design=${template.id}`}
      className="gallery-card"
    >
      <div className={`gallery-preview gallery-preview--${template.preview}`}>
        <span
          className="gallery-preview-blessing"
          style={{ color: template.accent }}
        >
          {template.blessing || '\u00A0'}
        </span>
        <span className="gallery-preview-name" style={{ color: template.accent }}>
          Ananya Sharma
        </span>
        {template.hasPhoto ? (
          <span
            className="gallery-preview-photo"
            style={{ borderRadius: template.photoRadius }}
          />
        ) : null}
        {LINE_WIDTHS.map((width) => (
          <span
            key={width}
            className="gallery-preview-line"
            style={{ width, background: template.lineBg }}
          />
        ))}
        <span
          className={`gallery-badge ${
            template.tier === 'Free' ? 'gallery-badge--free' : 'gallery-badge--premium'
          }`}
        >
          {template.tier}
        </span>
      </div>
      <div className="gallery-meta">
        <b>{template.name}</b>
        <span>{template.meta}</span>
      </div>
    </Link>
  );
}
