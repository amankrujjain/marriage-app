'use client';

import { EditorAccordion } from './EditorAccordion';
import { EditorField } from './EditorField';
import { EditorPhotoCard } from './EditorPhotoCard';
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
    <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
      <EditorPhotoCard />

      {sections.map((section) => {
        const open = openId === section.id;
        const count = countFilled(section.fields);
        const summary = `${section.blurb} · ${count.label}`;

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
            <div className="editor-field-grid">
              {section.fields.map((field, fi) =>
                reorderMode ? (
                  <div key={field.id} className="editor-reorder-row">
                    <input
                      className="editor-input"
                      value={field.label}
                      aria-label="Field label"
                      onChange={(e) =>
                        updateField(section.id, field.id, { label: e.target.value })
                      }
                    />
                    <div className="editor-reorder-actions">
                      <button
                        type="button"
                        className="editor-icon-btn"
                        disabled={fi === 0}
                        onClick={() => moveField(section.id, field.id, -1)}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="editor-icon-btn"
                        disabled={fi === section.fields.length - 1}
                        onClick={() => moveField(section.id, field.id, 1)}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="editor-icon-btn"
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
                    wide={Boolean(field.wide) || section.fields.length === 1}
                    label={field.label}
                    name={field.id}
                    value={field.value}
                    hint={field.hint}
                    placeholder={field.placeholder}
                    type={field.type}
                    onChange={(value) => updateField(section.id, field.id, { value })}
                  />
                ),
              )}
            </div>

            <div className="editor-section-actions">
              <button
                type="button"
                className="editor-btn-dashed"
                onClick={() => addField(section.id)}
              >
                + Add a field
              </button>
              <button
                type="button"
                className={`editor-btn-ghost ${reorderMode ? 'is-active' : ''}`}
                onClick={() => setReorderMode((v) => !v)}
              >
                {reorderMode ? 'Done renaming' : 'Rename or reorder fields'}
              </button>
              {section.custom ? (
                <button
                  type="button"
                  className="editor-btn-ghost"
                  onClick={() => removeSection(section.id)}
                >
                  Remove section
                </button>
              ) : null}
            </div>
          </EditorAccordion>
        );
      })}

      <button type="button" className="editor-add-section" onClick={addSection}>
        + Add a section (e.g. Partner expectations, Property)
      </button>
    </form>
  );
}
