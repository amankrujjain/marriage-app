'use client';

import { LANGUAGE_OPTIONS } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setExportLanguage } from '../store/languageSlice';

export function LanguageSelector() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.language.exportLanguage);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {LANGUAGE_OPTIONS.map((option) => {
        const active = selected === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => dispatch(setExportLanguage(option.code))}
            className={`min-h-14 border px-4 py-3 text-left transition ${
              active
                ? 'border-maroon bg-ivory ring-1 ring-maroon'
                : 'border-maroon/15 bg-ivory/60 hover:border-maroon/40'
            }`}
          >
            <span className="block font-display text-lg text-maroon">
              {option.nativeName}
            </span>
            <span className="font-body text-sm text-ink/60">{option.name}</span>
          </button>
        );
      })}
    </div>
  );
}
