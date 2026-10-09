'use client';

import { useRef } from 'react';
import type { DemoState, DemoTpl } from './demoTypes';
import { MANTRA_OPTIONS } from './demoTypes';
import { SAMPLE_PHOTO } from './demoSample';

type DemoFormPanelProps = {
  state: DemoState;
  onChange: (next: DemoState) => void;
};

const TPL_META: Array<{ key: DemoTpl; name: string; blurb: string }> = [
  { key: 'zari', name: 'Zari', blurb: 'Maroon and gold, traditional' },
  { key: 'panna', name: 'Panna', blurb: 'Emerald arch, royal' },
  { key: 'kagaz', name: 'Kagaz', blurb: 'Modern, no motifs' },
];

export function DemoFormPanel({ state, onChange }: DemoFormPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function patch(partial: Partial<DemoState>) {
    onChange({ ...state, ...partial });
  }

  function updateSectionTitle(si: number, title: string) {
    const sections = state.sections.map((s, i) => (i === si ? { ...s, title } : s));
    patch({ sections });
  }

  function updateField(si: number, fi: number, key: 'label' | 'value', value: string) {
    const sections = state.sections.map((s, i) => {
      if (i !== si) return s;
      return {
        ...s,
        fields: s.fields.map((f, j) => (j === fi ? { ...f, [key]: value } : f)),
      };
    });
    patch({ sections });
  }

  function moveField(si: number, fi: number, dir: -1 | 1) {
    const target = fi + dir;
    const section = state.sections[si];
    if (!section || target < 0 || target >= section.fields.length) return;
    const a = section.fields[fi];
    const b = section.fields[target];
    if (!a || !b) return;
    const fields = section.fields.map((f, i) => {
      if (i === fi) return b;
      if (i === target) return a;
      return f;
    });
    const sections = state.sections.map((s, i) => (i === si ? { ...s, fields } : s));
    patch({ sections });
  }

  function removeField(si: number, fi: number) {
    const sections = state.sections.map((s, i) =>
      i === si ? { ...s, fields: s.fields.filter((_, j) => j !== fi) } : s,
    );
    patch({ sections });
  }

  function addField(si: number) {
    const sections = state.sections.map((s, i) =>
      i === si ? { ...s, fields: [...s.fields, { label: 'New field', value: '' }] } : s,
    );
    patch({ sections });
  }

  function onPhotoFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ photo: String(reader.result ?? '') });
    reader.readAsDataURL(file);
  }

  return (
    <div className="demo-panel demo-stack">
      <div>
        <span className="demo-label" id="demo-tpl-label">
          Design
        </span>
        <div className="demo-tpl-row" role="group" aria-labelledby="demo-tpl-label">
          {TPL_META.map((tpl) => (
            <button
              key={tpl.key}
              type="button"
              className="demo-tpl"
              aria-pressed={state.tpl === tpl.key}
              onClick={() => patch({ tpl: tpl.key })}
            >
              <span className={`demo-sw demo-sw--${tpl.key}`} />
              <b>{tpl.name}</b>
              <small>{tpl.blurb}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="demo-row2">
        <div>
          <label className="demo-label" htmlFor="demo-mantra">
            Top blessing line
          </label>
          <select
            id="demo-mantra"
            className="demo-control"
            value={state.mantra}
            onChange={(e) => patch({ mantra: e.target.value })}
          >
            {MANTRA_OPTIONS.map((opt) => (
              <option key={opt || 'none'} value={opt}>
                {opt || 'None'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="demo-label" htmlFor="demo-doc-title">
            Page title
          </label>
          <input
            id="demo-doc-title"
            className="demo-control"
            type="text"
            value={state.docTitle}
            onChange={(e) => patch({ docTitle: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="demo-label" htmlFor="demo-full-name">
          Full name
        </label>
        <input
          id="demo-full-name"
          className="demo-control"
          type="text"
          value={state.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
      </div>

      <div>
        <span className="demo-label">Photo (3:4 portrait)</span>
        <div className="demo-photo-ctl">
          <span className="demo-btn demo-file-btn">
            Upload photo
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              aria-label="Upload photo"
              onChange={(e) => onPhotoFile(e.target.files?.[0] ?? null)}
            />
          </span>
          <button type="button" className="demo-btn demo-ghost" onClick={() => patch({ photo: '' })}>
            Remove photo
          </button>
          <button
            type="button"
            className="demo-btn demo-ghost"
            onClick={() => patch({ photo: SAMPLE_PHOTO })}
          >
            Use sample
          </button>
        </div>
      </div>

      <p className="demo-sample-note">
        Sample details are filled in so you can see the layout. Replace them with your own.
      </p>

      <div className="demo-stack">
        {state.sections.map((sec, si) => (
          <div key={si} className="demo-sec">
            <div className="demo-sec-head">
              <input
                type="text"
                aria-label="Section title"
                value={sec.title}
                onChange={(e) => updateSectionTitle(si, e.target.value)}
              />
            </div>
            <div className="demo-fields">
              {sec.fields.map((field, fi) => (
                <div key={fi} className="demo-f">
                  <input
                    type="text"
                    className="demo-lbl"
                    aria-label="Field label"
                    value={field.label}
                    onChange={(e) => updateField(si, fi, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    className="demo-val"
                    aria-label={field.label}
                    value={field.value}
                    placeholder="Blank — hidden"
                    onChange={(e) => updateField(si, fi, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    className="demo-icon-btn"
                    title="Move up"
                    disabled={fi === 0}
                    onClick={() => moveField(si, fi, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="demo-icon-btn"
                    title="Move down"
                    disabled={fi === sec.fields.length - 1}
                    onClick={() => moveField(si, fi, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="demo-icon-btn"
                    title="Remove field"
                    onClick={() => removeField(si, fi)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="demo-btn demo-ghost demo-add" onClick={() => addField(si)}>
              + Add field
            </button>
          </div>
        ))}
      </div>

      <p className="demo-hint">
        Leave a value blank to hide that line. Use ↑ ↓ to reorder, × to remove.
      </p>
    </div>
  );
}
