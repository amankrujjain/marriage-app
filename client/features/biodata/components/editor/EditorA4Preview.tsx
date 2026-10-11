'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { loadVp } from '@/lib/vp/loadVp';
import { isFreeDesign, slugFromTemplateId } from './designMap';
import { mapBiodataToVp } from './mapBiodataToVp';
import type { EditorSectionDef } from './editorSectionModel';

type EditorA4PreviewProps = {
  sections?: EditorSectionDef[];
};

type FitState = {
  over: boolean;
  tight: boolean;
  label: string;
  icon: string;
};

const A4_PX_W = (210 * 96) / 25.4;

function fitFromVp(f: { d: number; over: boolean }): FitState {
  if (f.over) {
    return {
      over: true,
      tight: false,
      icon: '!',
      label: 'Too long for 1 page even at smallest size. Shorten About or Expectations',
    };
  }
  if (f.d < 1) {
    return {
      over: false,
      tight: true,
      icon: f.d < 0.85 ? '!' : '✓',
      label:
        'Fits on 1 page · text scaled to ' +
        Math.round(f.d * 100) +
        '%' +
        (f.d < 0.85 ? ' (small, consider shortening)' : ''),
    };
  }
  return { over: false, tight: false, icon: '✓', label: 'Fits on 1 page' };
}

export function EditorA4Preview({ sections }: EditorA4PreviewProps) {
  const content = useAppSelector((state) => state.biodata.content);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const designSlug = useAppSelector(
    (state) => state.template.selectedDesignSlug || slugFromTemplateId(templateId),
  );
  const hostRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef(true);
  const [fit, setFit] = useState<FitState>({
    over: false,
    tight: false,
    icon: '✓',
    label: 'Fits on 1 page',
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let alive = true;
    const data = mapBiodataToVp(content, sections);
    const credit = isFreeDesign(designSlug);

    void loadVp().then((VP) => {
      if (!alive || !hostRef.current) return;
      const stage = hostRef.current;
      let result: { fit: { d: number; over: boolean } };
      if (firstRef.current || !stage.querySelector('.bd')) {
        firstRef.current = false;
        stage.innerHTML = '';
        const bd = VP.thumb(stage, data, designSlug, { credit });
        result = {
          fit: { d: +(bd.dataset.d || 1), over: bd.dataset.fit === 'over' },
        };
      } else {
        result = VP.update(stage, data, designSlug, { credit });
      }
      setFit(fitFromVp(result.fit));
      requestAnimationFrame(() => {
        if (!alive || !hostRef.current) return;
        const bd = hostRef.current.querySelector('.bd') as HTMLElement | null;
        if (!bd) return;
        VP.fit(bd);
        const w = hostRef.current.clientWidth || 200;
        bd.style.transform = `scale(${w / A4_PX_W})`;
        setFit(
          fitFromVp({
            d: +(bd.dataset.d || result.fit.d),
            over: bd.dataset.fit === 'over' || result.fit.over,
          }),
        );
      });
    });

    return () => {
      alive = false;
    };
  }, [content, sections, designSlug]);

  const fitClass = fit.over ? 'fit over' : fit.tight ? 'fit tight' : 'fit';

  return (
    <>
      <div className="prev-head">
        <h2>Live preview · A4</h2>
        <span className={fitClass} role="status" aria-live="polite">
          <i>{fit.icon}</i>
          <span>{fit.label}</span>
        </span>
      </div>
      <div className="stage">
        <div
          ref={hostRef}
          className="thumb"
          role="img"
          aria-label="Live A4 preview of your biodata"
        />
      </div>
    </>
  );
}
