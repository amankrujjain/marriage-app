'use client';

type EditorAccordionProps = {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

export function EditorAccordion({
  title,
  summary,
  open,
  onToggle,
  children,
}: EditorAccordionProps) {
  return (
    <section className={`editor-acc ${open ? 'is-open' : ''}`}>
      <button type="button" className="editor-acc-trigger" onClick={onToggle} aria-expanded={open}>
        <span className="editor-acc-copy">
          <b>{title}</b>
          <span>{summary}</span>
        </span>
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
      {open ? <div className="editor-acc-body">{children}</div> : null}
    </section>
  );
}
