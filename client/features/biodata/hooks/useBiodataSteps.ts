'use client';

import { BIODATA_STEP_ORDER, type BiodataFormStep } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setStep } from '../store/biodataSlice';

export function useBiodataSteps() {
  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => state.biodata.step);
  const index = BIODATA_STEP_ORDER.indexOf(step);

  function goNext(): void {
    const next = BIODATA_STEP_ORDER[index + 1];
    if (next) dispatch(setStep(next));
  }

  function goBack(): void {
    const prev = BIODATA_STEP_ORDER[index - 1];
    if (prev) dispatch(setStep(prev));
  }

  function goTo(target: BiodataFormStep): void {
    dispatch(setStep(target));
  }

  return {
    step,
    index,
    total: BIODATA_STEP_ORDER.length,
    isFirst: index <= 0,
    isLast: index >= BIODATA_STEP_ORDER.length - 1,
    goNext,
    goBack,
    goTo,
  };
}
