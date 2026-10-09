'use client';

import { PersonalStepBasics } from './PersonalStepBasics';
import { PersonalStepExtra } from './PersonalStepExtra';

export function PersonalStep() {
  return (
    <div className="flex flex-col gap-4">
      <PersonalStepBasics />
      <PersonalStepExtra />
    </div>
  );
}
