'use client';

import { BIODATA_STEP_LABELS, BIODATA_STEP_ORDER } from '@marriage/shared';
import { useBiodataSteps } from '../hooks/useBiodataSteps';

export function StepProgress() {
  const { step, index, total } = useBiodataSteps();

  return (
    <div className="mb-8">
      <p className="font-body text-sm text-ink/60">
        Step {index + 1} of {total}
      </p>
      <div className="mt-2 h-1 w-full bg-maroon/10">
        <div
          className="h-1 bg-maroon transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <ol className="mt-4 hidden gap-2 sm:flex sm:flex-wrap">
        {BIODATA_STEP_ORDER.map((item) => (
          <li
            key={item}
            className={`font-body text-xs ${
              item === step ? 'text-maroon' : 'text-ink/40'
            }`}
          >
            {BIODATA_STEP_LABELS[item]}
          </li>
        ))}
      </ol>
      <p className="mt-3 font-display text-2xl text-maroon sm:hidden">
        {BIODATA_STEP_LABELS[step]}
      </p>
    </div>
  );
}
