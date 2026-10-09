'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchCareer, patchEducation } from '../../store/biodataSlice';
import { BiodataField } from '../BiodataField';

export function EducationCareerStep() {
  const dispatch = useAppDispatch();
  const education = useAppSelector((state) => state.biodata.content.education);
  const career = useAppSelector((state) => state.biodata.content.career);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-sm tracking-wide text-maroon/70 uppercase">Education</p>
      <BiodataField
        label="Highest education"
        name="highestEducation"
        value={education.highestEducation ?? ''}
        onChange={(value) => dispatch(patchEducation({ highestEducation: value }))}
      />
      <BiodataField
        label="Institution"
        name="institution"
        value={education.institution ?? ''}
        onChange={(value) => dispatch(patchEducation({ institution: value }))}
      />
      <BiodataField
        label="Additional education"
        name="additionalEducation"
        value={education.additionalEducation ?? ''}
        onChange={(value) => dispatch(patchEducation({ additionalEducation: value }))}
      />
      <p className="mt-2 font-body text-sm tracking-wide text-maroon/70 uppercase">Career</p>
      <BiodataField
        label="Profession"
        name="profession"
        value={career.profession ?? ''}
        onChange={(value) => dispatch(patchCareer({ profession: value }))}
      />
      <BiodataField
        label="Company"
        name="company"
        value={career.company ?? ''}
        onChange={(value) => dispatch(patchCareer({ company: value }))}
      />
      <BiodataField
        label="Income"
        name="income"
        value={career.income ?? ''}
        onChange={(value) => dispatch(patchCareer({ income: value }))}
      />
      <BiodataField
        label="Work location"
        name="workLocation"
        value={career.workLocation ?? ''}
        onChange={(value) => dispatch(patchCareer({ workLocation: value }))}
      />
    </div>
  );
}
