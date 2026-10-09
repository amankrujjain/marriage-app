'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTemplate } from '@/features/templates/store/templateSlice';
import { EDITOR_DESIGNS, designKeyFromTemplate } from './designMap';

export function EditorDesignSwitcher() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.template.selectedTemplateId);
  const activeKey = designKeyFromTemplate(selected);

  return (
    <div className="editor-designs">
      <div className="editor-designs-head">
        <b>Design</b>
        <Link href="/templates">See all 12</Link>
      </div>
      <div className="editor-designs-grid">
        {EDITOR_DESIGNS.map((design) => (
          <button
            key={design.key}
            type="button"
            className={`editor-design-btn ${activeKey === design.key ? 'is-active' : ''}`}
            onClick={() => dispatch(selectTemplate(design.templateId))}
          >
            <span className={`editor-design-swatch editor-design-swatch--${design.key}`} />
            <span>{design.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
