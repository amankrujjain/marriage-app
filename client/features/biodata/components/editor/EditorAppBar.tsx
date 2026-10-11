'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

const STEPS = [
  { n: 1, label: 'Your details', href: '/marriage-biodata-maker', active: true },
  { n: 2, label: 'Design', href: '/templates', active: false },
  { n: 3, label: 'Download', href: '/download', active: false },
] as const;

export function EditorAppBar() {
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);

  const draftLabel =
    saveStatus === 'saving'
      ? 'Saving draft…'
      : saveStatus === 'saved'
        ? 'Draft saved on this device'
        : 'Draft stays on this device';

  return (
    <div className="editor-progress" aria-label="Biodata progress">
      <div className="editor-progress-inner">
        <ol className="editor-steps">
          {STEPS.map((step, index) => (
            <li key={step.n} className="editor-steps-item">
              {index > 0 ? <span className="editor-step-rule" aria-hidden /> : null}
              {step.active ? (
                <span className="editor-step is-active" aria-current="step">
                  <span className="editor-step-num">{step.n}</span>
                  {step.label}
                </span>
              ) : (
                <Link href={step.href} className="editor-step">
                  <span className="editor-step-num is-muted">{step.n}</span>
                  {step.label}
                </Link>
              )}
            </li>
          ))}
        </ol>

        <span className="editor-draft">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6B45" strokeWidth="2.2">
            <path d="M5 12l4 4L19 6" />
          </svg>
          {draftLabel}
        </span>
      </div>
    </div>
  );
}
