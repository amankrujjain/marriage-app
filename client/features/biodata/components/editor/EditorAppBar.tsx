'use client';

import Link from 'next/link';
import { LanguageCode } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setExportLanguage } from '@/features/translation/store/languageSlice';

export function EditorAppBar() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.language.exportLanguage);
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);

  const draftLabel =
    saveStatus === 'saving'
      ? 'Saving draft…'
      : saveStatus === 'saved'
        ? 'Draft saved on this device'
        : 'Draft stays on this device';

  return (
    <header className="editor-bar">
      <div className="editor-bar-inner">
        <Link href="/" className="editor-brand">
          Vivah Patra
        </Link>

        <ol className="editor-steps">
          <li className="editor-step is-active">
            <span className="editor-step-num">1</span>
            Your details
          </li>
          <li className="editor-step-rule" aria-hidden />
          <li className="editor-step">
            <span className="editor-step-num is-muted">2</span>
            Design
          </li>
          <li className="editor-step-rule" aria-hidden />
          <li className="editor-step">
            <span className="editor-step-num is-muted">3</span>
            Download
          </li>
        </ol>

        <div className="editor-bar-actions">
          <span className="editor-draft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6B45" strokeWidth="2.2">
              <path d="M5 12l4 4L19 6" />
            </svg>
            {draftLabel}
          </span>
          <div className="editor-lang" role="group" aria-label="Form language">
            <button
              type="button"
              className={lang === LanguageCode.EN ? 'is-active' : ''}
              onClick={() => dispatch(setExportLanguage(LanguageCode.EN))}
            >
              English
            </button>
            <button
              type="button"
              className={lang === LanguageCode.HI ? 'is-active' : ''}
              onClick={() => dispatch(setExportLanguage(LanguageCode.HI))}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
