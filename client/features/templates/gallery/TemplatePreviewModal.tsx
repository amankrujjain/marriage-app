'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { VpThumb } from '@/components/landing/VpThumb';
import type { GalleryTemplate } from './galleryCatalog';

type SampleKind = 'short' | 'long' | 'male';

type TemplatePreviewModalProps = {
  template: GalleryTemplate | null;
  onClose: () => void;
};

export function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  const titleId = useId();
  const [sample, setSample] = useState<SampleKind>('short');

  useEffect(() => {
    setSample('short');
  }, [template?.slug]);

  useEffect(() => {
    if (!template) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [template, onClose]);

  const open = !!template;

  return (
    <div
      className={`modal${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {template ? (
        <div className="modal-card">
          <button className="modal-x" type="button" aria-label="Close preview" onClick={onClose}>
            ×
          </button>
          <div>
            <VpThumb
              slug={template.slug}
              sample={sample}
              credit={template.tier === 'Free'}
              aria-label={`${template.name} preview`}
            />
          </div>
          <div>
            <span className="eyebrow">{template.cat} design</span>
            <h2 id={titleId}>{template.name}</h2>
            <p style={{ color: 'var(--ink-2)' }}>{template.blurb}</p>
            <p>
              <span className={`badge ${template.tier === 'Free' ? 'free' : 'prem'}`}>
                {template.tier}
              </span>{' '}
              <span className="note">Suits: {template.faith.join(', ')}</span>
            </p>
            <fieldset>
              <legend className="note">Try it with</legend>
              {(
                [
                  ['short', 'Short details'],
                  ['long', 'Long details'],
                  ['male', 'Groom sample'],
                ] as const
              ).map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="ms"
                    value={value}
                    checked={sample === value}
                    onChange={() => setSample(value)}
                  />{' '}
                  {label}
                </label>
              ))}
            </fieldset>
            <p className="note" style={{ marginTop: 10 }}>
              Fits on 1 page.
            </p>
            <div className="modal-actions">
              <Link
                className="btn btn-primary"
                href={`/marriage-biodata-maker?design=${template.slug}`}
              >
                Use this design
              </Link>
              <button className="btn btn-line" type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
