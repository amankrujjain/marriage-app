'use client';

import { useMemo, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { DemoA4Page } from '@/features/demo/DemoA4Page';
import { mapBiodataToDemo } from '@/features/demo/mapBiodataToDemo';
import { useFitScale } from '@/features/demo/useFitScale';

export function DownloadPreviews() {
  const content = useAppSelector((state) => state.biodata.content);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const pageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const demoState = useMemo(
    () => mapBiodataToDemo(content, templateId),
    [content, templateId],
  );

  const { fit, scale } = useFitScale(pageRef, stageRef, [demoState]);
  const name = demoState.name;
  const photo = demoState.photo;

  return (
    <section className="dl-previews">
      <h1>Check it once more, then download</h1>
      <div className="dl-preview-row">
        <figure className="dl-figure dl-figure--a4">
          <div className="demo-stage dl-a4-stage" ref={stageRef}>
            <div className="demo-scaler" style={{ transform: `scale(${scale})` }}>
              <DemoA4Page ref={pageRef} state={demoState} fontSizePx={fit.fontSize} />
            </div>
          </div>
          <figcaption>
            <b>A4 PDF</b> · for printing and email
            <span className={`demo-chip demo-chip--${fit.kind} dl-fit-inline`}>{fit.label}</span>
          </figcaption>
        </figure>

        <figure className="dl-figure dl-figure--wa">
          <div className="dl-phone">
            <div className="dl-phone-screen">
              <span className="dl-phone-name">{name}</span>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="dl-phone-photo" />
              ) : (
                <span className="dl-phone-photo dl-phone-photo--empty" />
              )}
              <span className="dl-phone-line" style={{ width: '100%' }} />
              <span className="dl-phone-line" style={{ width: '86%' }} />
              <span className="dl-phone-line" style={{ width: '92%' }} />
              <span className="dl-phone-line" style={{ width: '74%' }} />
              <span className="dl-phone-line" style={{ width: '88%' }} />
            </div>
          </div>
          <figcaption>
            <b>WhatsApp image</b> · 1080 × 1920, large text
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
