'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectDesign } from '@/features/templates/store/templateSlice';
import { setDesignSlug } from '../../store/biodataSlice';
import { loadVp } from '@/lib/vp/loadVp';
import { slugFromTemplateId } from './designMap';
import { useDesignCatalog } from '@/features/designs/hooks/useDesignCatalog';

const A4_PX_W = (210 * 96) / 25.4;

function paintThumb(
  VP: Window['VP'],
  th: HTMLElement,
  slug: string,
): void {
  th.innerHTML = '';
  const sample = VP.sampleFor ? VP.sampleFor(slug, 'short') : VP.sampleShort;
  VP.thumb(th, sample, slug, { credit: false });
  requestAnimationFrame(() => {
    const bd = th.firstElementChild as HTMLElement | null;
    if (!bd?.classList.contains('bd')) return;
    VP.fit(bd);
    bd.style.transform = `scale(${(th.clientWidth || 66) / A4_PX_W})`;
  });
}

export function EditorDesignSwitcher() {
  const dispatch = useAppDispatch();
  const { editorDesigns } = useDesignCatalog();
  const selectedSlug = useAppSelector(
    (state) =>
      state.template.selectedDesignSlug ||
      slugFromTemplateId(state.template.selectedTemplateId),
  );
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stripRef.current;
    if (!root) return;
    let alive = true;
    let observer: IntersectionObserver | null = null;

    void loadVp().then((VP) => {
      if (!alive || !stripRef.current) return;

      const painted = new WeakSet<HTMLElement>();

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const btn = entry.target as HTMLElement;
            const th = btn.querySelector<HTMLElement>('.thumb');
            const slug = btn.dataset.slug;
            if (!th || !slug || painted.has(th)) continue;
            painted.add(th);
            paintThumb(VP, th, slug);
          }
        },
        { root, rootMargin: '80px', threshold: 0.01 },
      );

      stripRef.current.querySelectorAll<HTMLElement>('button[data-slug]').forEach((btn) => {
        observer?.observe(btn);
      });
    });

    return () => {
      alive = false;
      observer?.disconnect();
    };
  }, [editorDesigns]);

  return (
    <div className="sw" ref={stripRef} role="group" aria-label="Choose a design" id="design">
      {editorDesigns.map((design) => (
        <button
          key={design.slug}
          type="button"
          data-slug={design.slug}
          aria-pressed={selectedSlug === design.slug}
          aria-label={`${design.name} (${design.tier})`}
          onClick={() => {
            dispatch(selectDesign({ templateId: design.templateId, slug: design.slug }));
            dispatch(setDesignSlug(design.slug));
          }}
        >
          <div className="thumb" />
          {design.shortName}
          {design.tier === 'Premium' ? ' ★' : ''}
        </button>
      ))}
    </div>
  );
}
