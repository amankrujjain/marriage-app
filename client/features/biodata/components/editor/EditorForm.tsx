'use client';

import { EditorAccordion } from './EditorAccordion';
import { EditorField } from './EditorField';
import { EditorGenderRow } from './EditorGenderRow';
import { EditorPhotoCard } from './EditorPhotoCard';
import { EditorPresentationCard } from './EditorPresentationCard';
import { countFilled } from './editorSectionModel';
import type { useEditorSections } from './useEditorSections';

type EditorFormProps = {
  sectionsApi: ReturnType<typeof useEditorSections>;
};

export function EditorForm({ sectionsApi }: EditorFormProps) {
  const {
    sections,
    openId,
    reorderMode,
    setReorderMode,
    toggleSection,
    updateField,
    updateSectionTitle,
    addField,
    removeField,
    moveField,
    addSection,
    removeSection,
  } = sectionsApi;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <EditorPhotoCard />
      <EditorPresentationCard />

      {sections.map((section) => {
        const open = openId === section.id;
        const count = countFilled(section.fields);
        const summary = `${section.blurb} · ${count.label}`;
        const useTextarea = /about|expectation/i.test(section.title);

        return (
          <EditorAccordion
            key={section.id}
            title={section.title}
            summary={summary}
            open={open}
            onToggle={() => toggleSection(section.id)}
            canRename
            onRename={(title) => updateSectionTitle(section.id, title)}
          >
            {section.id === 'personal' ? <EditorGenderRow /> : null}
            {section.fields.map((field, fi) =>
              reorderMode ? (
                <div key={field.id} className="frow">
                  <label>Label</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      className="input"
                      value={field.label}
                      aria-label="Field label"
                      onChange={(e) =>
                        updateField(section.id, field.id, { label: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-line btn-sm"
                      disabled={fi === 0}
                      onClick={() => moveField(section.id, field.id, -1)}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-line btn-sm"
                      disabled={fi === section.fields.length - 1}
                      onClick={() => moveField(section.id, field.id, 1)}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn btn-line btn-sm"
                      onClick={() => removeField(section.id, field.id)}
                      title="Remove field"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <EditorField
                  key={field.id}
                  wide={Boolean(field.wide) || section.fields.length === 1 || useTextarea}
                  label={field.label}
                  name={field.id}
                  value={field.value}
                  hint={field.hint}
                  placeholder={field.placeholder}
                  type={useTextarea || field.wide ? 'textarea' : field.type}
                  onChange={(value) => updateField(section.id, field.id, { value })}
                />
              ),
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              <button type="button" className="btn btn-line btn-sm" onClick={() => addField(section.id)}>
                + Add a field
              </button>
              <button
                type="button"
                className="btn btn-line btn-sm"
                onClick={() => setReorderMode((v) => !v)}
              >
                {reorderMode ? 'Done renaming' : 'Rename or reorder fields'}
              </button>
              {section.custom ? (
                <button
                  type="button"
                  className="btn btn-line btn-sm"
                  onClick={() => removeSection(section.id)}
                >
                  Remove section
                </button>
              ) : null}
            </div>
          </EditorAccordion>
        );
      })}

      <button
        type="button"
        className="btn btn-line"
        style={{ width: '100%', marginTop: 4 }}
        onClick={addSection}
      >
        + Add a section (e.g. Partner expectations, Property)
      </button>
    </form>
  );
}
