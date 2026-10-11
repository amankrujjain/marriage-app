'use client';

import { BIODATA_STEP_ORDER, BiodataFormStep, type BiodataFormStep as Step } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setStep } from '../store/biodataSlice';

function resolveStepIndex(step: Step): number {
  const index = BIODATA_STEP_ORDER.indexOf(step);
  if (index >= 0) return index;
  if (step === BiodataFormStep.LANGUAGE) {
    return BIODATA_STEP_ORDER.indexOf(BiodataFormStep.PREVIEW);
  }
  return 0;
}

export function useBiodataSteps() {
  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => state.biodata.step);
  const index = resolveStepIndex(step);
  const isFirst = index <= 0;
  const isLast = index >= BIODATA_STEP_ORDER.length - 1;

  function goTo(target: Step): void {
    dispatch(setStep(target));
  }

  function goNext(): void {
    const next = BIODATA_STEP_ORDER[index + 1];
    if (!next) return;
    dispatch(setStep(next));
  }

  function goBack(): void {
    const prev = BIODATA_STEP_ORDER[index - 1];
    if (!prev) return;
    dispatch(setStep(prev));
  }

  return {
    step,
    index,
    total: BIODATA_STEP_ORDER.length,
    isFirst,
    isLast,
    goTo,
    goNext,
    goBack,
  };
}
