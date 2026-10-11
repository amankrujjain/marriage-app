'use client';

import { useMemo, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { DemoA4Page } from '@/features/demo/DemoA4Page';
import { mapBiodataToDemo } from '@/features/demo/mapBiodataToDemo';
import { useFitScale } from '@/features/demo/useFitScale';
import type { EditorSectionDef } from './editorSectionModel';

type EditorA4PreviewProps = {
  sections?: EditorSectionDef[];
};

export function EditorA4Preview({ sections }: EditorA4PreviewProps) {
  const content = useAppSelector((state) => state.biodata.content);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const pageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const demoState = useMemo(
    () =>
      mapBiodataToDemo(content, templateId, {
        sections: sections?.map((s) => ({
          title: s.title,
          fields: s.fields.map((f) => ({ label: f.label, value: f.value })),
        })),
      }),
    [content, templateId, sections],
  );

  const { fit, scale } = useFitScale(pageRef, stageRef, [demoState]);

  return (
    <div className="editor-demo-stage-wrap">
      <div className="editor-preview-head editor-preview-head--inline">
        <b>Live preview · A4</b>
        <span className={`demo-chip demo-chip--${fit.kind}`} role="status">
          {fit.label}
        </span>
      </div>
      <div className="demo-stage editor-demo-stage" ref={stageRef}>
        <div className="demo-scaler" style={{ transform: `scale(${scale})` }}>
          <DemoA4Page ref={pageRef} state={demoState} fontSizePx={fit.fontSize} />
        </div>
      </div>
    </div>
  );
}
