'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectDesign } from '@/features/templates/store/templateSlice';
import { setDesignSlug } from '../../store/biodataSlice';
import { loadVp } from '@/lib/vp/loadVp';
import { EDITOR_DESIGNS, slugFromTemplateId } from './designMap';

const A4_PX_W = (210 * 96) / 25.4;

export function EditorDesignSwitcher() {
  const dispatch = useAppDispatch();
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

    void loadVp().then((VP) => {
      if (!alive || !stripRef.current) return;
      stripRef.current.querySelectorAll<HTMLElement>('button .thumb').forEach((th) => {
        const slug = th.closest('button')?.dataset.slug;
        if (!slug || th.firstChild) return;
        VP.thumb(th, VP.sampleShort, slug, { credit: false });
        requestAnimationFrame(() => {
          const bd = th.firstElementChild as HTMLElement | null;
          if (!bd?.classList.contains('bd')) return;
          VP.fit(bd);
          bd.style.transform = `scale(${(th.clientWidth || 66) / A4_PX_W})`;
        });
      });
    });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="sw" ref={stripRef} role="group" aria-label="Choose a design" id="design">
      {EDITOR_DESIGNS.map((design) => (
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
