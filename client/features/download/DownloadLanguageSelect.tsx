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
    <div className="dl-lang">
      <label className="dl-lang-label" htmlFor="download-language">
        Language for download
      </label>
      <select
        id="download-language"
        className="dl-lang-select"
        value={selected}
        disabled={disabled}
        onChange={(event) =>
          dispatch(setExportLanguage(event.target.value as LanguageCode))
        }
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name} ({option.nativeName})
          </option>
        ))}
      </select>
      <p className="dl-lang-note">
        Field labels stay in English. Only filled values are translated in the downloaded
        file. Names stay as you typed them.
        {translationStatus === 'loading' ? ' Updating preview…' : null}
      </p>
    </div>
  );
}
