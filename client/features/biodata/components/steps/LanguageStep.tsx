'use client';

import { LanguageSelector } from '@/features/translation/components/LanguageSelector';
import { useTranslateBiodata } from '@/features/translation/hooks/useTranslateBiodata';
import { useAppSelector } from '@/store/hooks';
import { useBiodataSteps } from '../../hooks/useBiodataSteps';

export function LanguageStep() {
  const { translate } = useTranslateBiodata();
  const { goNext } = useBiodataSteps();
  const status = useAppSelector((state) => state.language.status);
  const error = useAppSelector((state) => state.language.error);
  const provider = useAppSelector((state) => state.language.provider);
  const cached = useAppSelector((state) => state.language.cached);

  async function onGenerate(): Promise<void> {
    const ok = await translate();
    if (ok) goNext();
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="font-body text-ink/75">
        Choose the export language. Translation runs once when you generate — not while typing.
      </p>
      <LanguageSelector />
      {error ? <p className="text-sm text-maroon">{error}</p> : null}
      {status === 'ready' && provider ? (
        <p className="text-sm text-ink/60">
          Ready via {provider}
          {cached ? ' (cached)' : ''}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void onGenerate()}
        disabled={status === 'loading'}
        className="min-h-12 bg-maroon px-8 font-body text-ivory disabled:opacity-60"
      >
        {status === 'loading' ? 'Translating…' : 'Generate preview'}
      </button>
    </div>
  );
}
