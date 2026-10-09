'use client';

import Link from 'next/link';
import { BiodataFormStep } from '@marriage/shared';
import { MotifBg } from '@/components/landing/MotifBg';
import { useAppSelector } from '@/store/hooks';
import { StepProgress } from './StepProgress';
import { StepRenderer } from './StepRenderer';
import { StepNav } from './StepNav';

export function BiodataWizard() {
  const saveError = useAppSelector((state) => state.biodata.saveError);
  const saveStatus = useAppSelector((state) => state.biodata.saveStatus);
  const biodataId = useAppSelector((state) => state.biodata.biodataId);
  const step = useAppSelector((state) => state.biodata.step);
  const wide =
    step === BiodataFormStep.TEMPLATE ||
    step === BiodataFormStep.LANGUAGE ||
    step === BiodataFormStep.PREVIEW;

  return (
    <main className="relative min-h-screen px-6 py-10 sm:py-14">
      <MotifBg />
      <div
        className={`relative z-10 mx-auto w-full ${wide ? 'max-w-2xl' : 'max-w-xl'}`}
      >
        <Link href="/" className="font-display text-2xl text-maroon">
          Vivah Patra
        </Link>
        <div className="mt-2 h-px w-16 bg-gold" />
        <h1 className="mt-6 font-display text-3xl text-maroon sm:text-4xl">
          Marriage Biodata Maker
        </h1>
        <p className="mt-2 font-body text-ink/70">
          Fill details, pick a template, then preview your biodata.
        </p>
        <div className="mt-8">
          <StepProgress />
          <StepRenderer />
          {saveError ? <p className="mt-4 text-sm text-maroon">{saveError}</p> : null}
          {saveStatus === 'saved' && biodataId ? (
            <p className="mt-4 text-sm text-ink/70">Draft saved.</p>
          ) : null}
          <StepNav />
        </div>
      </div>
    </main>
  );
}
