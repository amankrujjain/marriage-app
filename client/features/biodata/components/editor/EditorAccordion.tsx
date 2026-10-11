'use client';

import { useEffect, useRef, useState } from 'react';

type EditorAccordionProps = {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  onRename?: (title: string) => void;
  canRename?: boolean;
  icon?: React.ReactNode;
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
  icon,
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
    <details className="panel" open={open}>
      <summary
        onClick={(e) => {
          e.preventDefault();
          if (!editing) onToggle();
        }}
      >
        {icon ?? (
          <svg className="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1-5 4-7 8-7s7 2 8 7z" />
          </svg>
        )}
        {editing && canRename ? (
          <span className="editor-acc-rename" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              className="input"
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
              className="btn btn-line btn-sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={commitRename}
            >
              Done
            </button>
          </span>
        ) : (
          <>
            <span>
              {title}
              {summary ? (
                <small
                  style={{
                    display: 'block',
                    fontWeight: 500,
                    color: 'var(--ink-3)',
                    fontSize: '.8rem',
                  }}
                >
                  {summary}
                </small>
              ) : null}
            </span>
            {canRename ? (
              <button
                type="button"
                title="Rename section"
                aria-label={`Rename ${title}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditing(true);
                }}
                style={{
                  marginLeft: 6,
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  color: 'var(--ink-3)',
                  padding: 4,
                }}
              >
                <PenIcon />
              </button>
            ) : null}
          </>
        )}
      </summary>
      {open ? <div className="pb">{children}</div> : null}
    </details>
  );
}
