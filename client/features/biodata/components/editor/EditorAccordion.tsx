'use client';

import { useEffect, useRef, useState } from 'react';

type EditorAccordionProps = {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  onRename?: (title: string) => void;
  canRename?: boolean;
  children?: React.ReactNode;
};

function PenIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function EditorAccordion({
  title,
  summary,
  open,
  onToggle,
  onRename,
  canRename = false,
  children,
}: EditorAccordionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(title);
  }, [title]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commitRename() {
    const next = draft.trim() || title;
    setDraft(next);
    onRename?.(next);
    setEditing(false);
  }

  return (
    <section className={`editor-acc ${open ? 'is-open' : ''}`}>
      <div className={`editor-acc-header ${open ? 'is-open' : ''}`}>
        {editing && canRename ? (
          <div className="editor-acc-rename">
            <input
              ref={inputRef}
              className="editor-input editor-acc-rename-input"
              value={draft}
              aria-label="Section title"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitRename();
                }
                if (e.key === 'Escape') {
                  setDraft(title);
                  setEditing(false);
                }
              }}
              onBlur={commitRename}
            />
            <button
              type="button"
              className="editor-acc-rename-done"
              onMouseDown={(e) => e.preventDefault()}
              onClick={commitRename}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="editor-acc-left">
              <div className="editor-acc-title-row">
                <button type="button" className="editor-acc-title-btn" onClick={onToggle}>
                  <b>{title}</b>
                </button>
                {canRename ? (
                  <button
                    type="button"
                    className="editor-acc-pen"
                    title="Rename section"
                    aria-label={`Rename ${title}`}
                    onClick={() => setEditing(true)}
                  >
                    <PenIcon />
                  </button>
                ) : null}
              </div>
              <button type="button" className="editor-acc-summary-btn" onClick={onToggle}>
                {summary}
              </button>
            </div>
            <button
              type="button"
              className="editor-acc-chevron-btn"
              onClick={onToggle}
              aria-expanded={open}
              aria-label={open ? 'Collapse section' : 'Expand section'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5E4A4D"
                strokeWidth="2"
                aria-hidden
                className="editor-acc-chevron"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
      {open ? <div className="editor-acc-body">{children}</div> : null}
    </section>
  );
}
