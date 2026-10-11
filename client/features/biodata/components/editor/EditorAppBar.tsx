'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export function EditorAppBar() {
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);

  const draftLabel =
    saveStatus === 'saving'
      ? 'Saving draft…'
      : saveStatus === 'saved'
        ? 'Draft saved on this device'
        : 'Draft saved on this device';

  return (
    <div className="stepper">
      <div className="wrap" role="navigation" aria-label="Progress">
        <span className="st on" aria-current="step">
          <i>1</i>
          <span>Your details</span>
        </span>
        <div className="st-line" style={{ ['--p' as string]: 0 }}>
          <b />
        </div>
        <Link className="st" href="#design">
          <i>2</i>
          <span>Design</span>
        </Link>
        <div className="st-line" style={{ ['--p' as string]: 0 }}>
          <b />
        </div>
        <Link className="st" href="/download">
          <i>3</i>
          <span>Download</span>
        </Link>
        <div
          className={`saved${saveStatus === 'saving' ? ' saving' : ''}`}
          role="status"
          aria-live="polite"
        >
          <i>{saveStatus === 'saving' ? '…' : '✓'}</i>
          <span>{draftLabel}</span>
        </div>
      </div>
    </div>
  );
}
