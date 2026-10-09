'use client';

import { useRef } from 'react';
import type { DemoState } from './demoTypes';
import { DemoA4Page } from './DemoA4Page';
import { useFitScale } from './useFitScale';

export function DemoPreviewStage({ state }: { state: DemoState }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { fit, scale } = useFitScale(pageRef, stageRef, [
    state.tpl,
    state.mantra,
    state.docTitle,
    state.name,
    state.photo,
    state.sections,
  ]);

  return (
    <div className="demo-preview-col">
      <div className="demo-pv-bar">
        <span className="demo-label" style={{ margin: 0 }}>
          Live preview · A4
        </span>
        <span className={`demo-chip demo-chip--${fit.kind}`} role="status">
          {fit.label}
        </span>
      </div>
      <div className="demo-stage" ref={stageRef}>
        <div className="demo-scaler" style={{ transform: `scale(${scale})` }}>
          <DemoA4Page ref={pageRef} state={state} fontSizePx={fit.fontSize} />
        </div>
      </div>
      <p className="demo-pv-note">
        On the live site, Download turns this exact page into an A4 PDF and a WhatsApp-sized image.
      </p>
    </div>
  );
}
