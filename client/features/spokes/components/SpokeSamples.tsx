'use client';

import Link from 'next/link';
import { VpThumb } from '@/components/landing/VpThumb';
import type { SpokePageConfig } from '@/content/spokes/types';
import { useDesignCatalog } from '@/features/designs/hooks/useDesignCatalog';

type SpokeSamplesProps = {
  page: SpokePageConfig;
  imageBySlug?: Record<string, string>;
};

export function SpokeSamples({ page, imageBySlug = {} }: SpokeSamplesProps) {
  const { activeGallery } = useDesignCatalog();
  const { samples } = page;
  if (samples.count <= 0 && !samples.designSlugs?.length) return null;

  const bySlug = new Map(activeGallery.map((d) => [d.slug, d]));
  let designs =
    samples.designSlugs && samples.designSlugs.length > 0
      ? samples.designSlugs
          .map((slug) => bySlug.get(slug) ?? { slug, name: slug })
          .slice(0, samples.count || samples.designSlugs.length)
      : activeGallery.slice(0, samples.count);

  if (samples.includeNoPhoto && designs.length > 0) {
    const first = designs[0];
    if (first) {
      if (designs.length >= samples.count) {
        designs = designs.slice(0, Math.max(1, samples.count - 1));
      }
      designs = [...designs, { ...first, slug: `${first.slug}__nophoto` }];
    }
  }

  return (
    <section className="sec" aria-labelledby="spoke-samples-h">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-samples-h">{samples.heading}</h2>
        </div>
        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          {designs.map((design, index) => {
            const isNoPhoto = design.slug.endsWith('__nophoto');
            const realSlug = isNoPhoto
              ? design.slug.replace(/__nophoto$/, '')
              : design.slug;
            const name =
              'name' in design && typeof design.name === 'string'
                ? design.name
                : realSlug;
            const label = `${name} biodata ${samples.qualifier}`;
            const href = `${page.path}?design=${encodeURIComponent(realSlug)}#form`;
            const imgSrc = imageBySlug[realSlug];

            return (
              <figure key={`${design.slug}-${index}`} style={{ margin: 0 }}>
                <Link href={href} aria-label={label}>
                  {imgSrc && !isNoPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc}
                      alt={`${name} marriage biodata ${samples.qualifier}`}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  ) : (
                    <VpThumb
                      slug={realSlug}
                      credit={false}
                      aria-label={label}
                    />
                  )}
                </Link>
                <figcaption style={{ marginTop: 8, fontSize: '0.875rem' }}>
                  {label}
                  {isNoPhoto ? ' (no photo)' : ''}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
