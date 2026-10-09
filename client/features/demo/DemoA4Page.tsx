'use client';

import { forwardRef } from 'react';
import type { DemoState } from './demoTypes';
import { CornerOrnament, LotusMotif } from './DemoMotifs';

type DemoA4PageProps = {
  state: DemoState;
  fontSizePx: number;
};

function FieldRows({
  fields,
}: {
  fields: Array<{ label: string; value: string }>;
}) {
  const shown = fields.filter((f) => f.value.trim());
  if (shown.length === 0) return null;
  return (
    <div className="demo-page-rows">
      {shown.map((f) => (
        <div key={`${f.label}-${f.value}`} className="demo-page-row">
          <span className="demo-page-k">{f.label}</span>
          <span className="demo-page-c">:</span>
          <span className="demo-page-v">{f.value}</span>
        </div>
      ))}
    </div>
  );
}

export const DemoA4Page = forwardRef<HTMLDivElement, DemoA4PageProps>(
  function DemoA4Page({ state, fontSizePx }, ref) {
    return (
      <div
        ref={ref}
        className="demo-page"
        data-tpl={state.tpl}
        data-biodata-preview
        style={{ ['--fs' as string]: `${fontSizePx}px` }}
      >
        <div className="demo-page-frame" />
        {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
          <div key={corner} className={`demo-page-corner ${corner}`}>
            <CornerOrnament />
          </div>
        ))}
        <div className="demo-page-content" id="demo-page-content">
          {state.mantra ? (
            <div>
              <div className="demo-page-motif">
                <LotusMotif />
              </div>
              <p className="demo-page-mantra">{state.mantra}</p>
            </div>
          ) : null}
          {state.docTitle.trim() ? (
            <p className="demo-page-doctitle">{state.docTitle}</p>
          ) : null}
          <h2 className="demo-page-name">{state.name.trim() || 'Your Name'}</h2>
          {state.sections.map((sec, i) => {
            const withPhoto = i === 0 && Boolean(state.photo);
            const hasFields = sec.fields.some((f) => f.value.trim());
            if (!hasFields && !withPhoto) return null;
            return (
              <section key={`${sec.title}-${i}`}>
                <h3>{sec.title}</h3>
                {withPhoto ? (
                  <div className="demo-page-split">
                    <div>
                      <FieldRows fields={sec.fields} />
                    </div>
                    <div className="demo-page-photo-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="demo-page-photo" src={state.photo} alt="" />
                    </div>
                  </div>
                ) : (
                  <FieldRows fields={sec.fields} />
                )}
              </section>
            );
          })}
        </div>
      </div>
    );
  },
);
