'use client';

import { LANGUAGE_OPTIONS, type LanguageCode } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setExportLanguage } from '@/features/translation/store/languageSlice';

type DownloadLanguageSelectProps = {
  disabled?: boolean;
};

export function DownloadLanguageSelect({ disabled }: DownloadLanguageSelectProps) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.language.exportLanguage);
  const translationStatus = useAppSelector((state) => state.language.status);

  return (
    <div className="fld" style={{ margin: '12px 0 4px' }}>
      <label htmlFor="download-language">Language for download</label>
      <select
        id="download-language"
        className="input"
        value={selected}
        disabled={disabled}
        onChange={(event) =>
          dispatch(setExportLanguage(event.target.value as LanguageCode))
        }
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.nativeName} ({option.name})
          </option>
        ))}
      </select>
      {translationStatus === 'loading' ? (
        <span className="note">Updating preview…</span>
      ) : null}
    </div>
  );
}
