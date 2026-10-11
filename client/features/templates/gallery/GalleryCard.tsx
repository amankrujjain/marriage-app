import Link from 'next/link';
import { VpThumb } from '@/components/landing/VpThumb';
import type { GalleryTemplate } from './galleryCatalog';

type GalleryCardProps = {
  template: GalleryTemplate;
  onPreview: () => void;
};

export function GalleryCard({ template, onPreview }: GalleryCardProps) {
  return (
    <article className="tpl-card reveal">
      <button
        className="thumb-btn"
        type="button"
        aria-label={`Preview ${template.name}`}
        onClick={onPreview}
      >
        <VpThumb
          slug={template.slug}
          credit={template.tier === 'Free'}
          aria-label={`${template.name} sample`}
        />
      </button>
      <h3>{template.name}</h3>
      <div>
        <span className={`badge ${template.tier === 'Free' ? 'free' : 'prem'}`}>
          {template.tier}
        </span>
      </div>
      <div className="tags">
        {template.cat} · {template.faith.join(', ')}
      </div>
      <div className="acts">
        <button className="btn btn-line btn-sm" type="button" onClick={onPreview}>
          Preview
        </button>
        <Link
          className="btn btn-primary btn-sm"
          href={`/marriage-biodata-maker?design=${template.slug}`}
        >
          Use design
        </Link>
      </div>
    </article>
  );
}
