'use client';

import { useAppSelector } from '@/store/hooks';

export function EditorSaveStatus({ className }: { className?: string }) {
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);
  const draftLabel =
    saveStatus === 'saving'
      ? 'Saving draft…'
      : 'Draft saved on this device';

  return (
    <span
      className={`saved${saveStatus === 'saving' ? ' saving' : ''}${className ? ` ${className}` : ''}`}
      role="status"
      aria-live="polite"
    >
      <i aria-hidden>{saveStatus === 'saving' ? '…' : '✓'}</i>
      <span>{draftLabel}</span>
    </span>
  );
}
