'use client';

import { BiodataFormStep } from '@marriage/shared';
import { useBiodataSteps } from '../hooks/useBiodataSteps';
import { useSaveBiodata } from '../hooks/useSaveBiodata';
import { useAppSelector } from '@/store/hooks';

export function StepNav() {
  const { isFirst, isLast, goBack, goNext, step } = useBiodataSteps();
  const { save } = useSaveBiodata();
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);
  const hideContinue = step === BiodataFormStep.LANGUAGE;

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        disabled={isFirst}
        onClick={goBack}
        className="min-h-12 px-6 font-body text-maroon underline decoration-gold underline-offset-4 disabled:opacity-40"
      >
        Back
      </button>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void save()}
          className="min-h-12 border border-maroon px-6 font-body text-maroon"
        >
          {saveStatus === 'saving' ? 'Saving…' : 'Save draft'}
        </button>
        {!hideContinue && !isLast ? (
          <button
            type="button"
            onClick={goNext}
            className="min-h-12 bg-maroon px-8 font-body text-ivory"
          >
            Continue
          </button>
        ) : null}
        {isLast ? (
          <button
            type="button"
            onClick={() => void save()}
            className="min-h-12 bg-maroon px-8 font-body text-ivory"
          >
            Save & continue later
          </button>
        ) : null}
      </div>
    </div>
  );
}
