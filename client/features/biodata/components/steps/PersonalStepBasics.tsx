'use client';

import { Gender } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchPersonal } from '../../store/biodataSlice';
import { BiodataField } from '../BiodataField';
import { BiodataSelect } from '../BiodataSelect';

export function PersonalStepBasics() {
  const dispatch = useAppDispatch();
  const personal = useAppSelector((state) => state.biodata.content.personal);

  return (
    <>
      <BiodataField
        label="Full name"
        name="fullName"
        value={personal.fullName ?? ''}
        optional={false}
        onChange={(value) => dispatch(patchPersonal({ fullName: value }))}
      />
      <BiodataSelect
        label="Gender"
        name="gender"
        value={personal.gender ?? ''}
        onChange={(value) =>
          dispatch(patchPersonal({ gender: (value || undefined) as Gender | undefined }))
        }
        options={[
          { value: Gender.MALE, label: 'Male' },
          { value: Gender.FEMALE, label: 'Female' },
          { value: Gender.OTHER, label: 'Other' },
        ]}
      />
      <BiodataField
        label="Date of birth"
        name="dateOfBirth"
        type="date"
        value={personal.dateOfBirth ?? ''}
        onChange={(value) => dispatch(patchPersonal({ dateOfBirth: value }))}
      />
      <BiodataField
        label="Height"
        name="height"
        value={personal.height ?? ''}
        onChange={(value) => dispatch(patchPersonal({ height: value }))}
      />
      <BiodataField
        label="Religion"
        name="religion"
        value={personal.religion ?? ''}
        onChange={(value) => dispatch(patchPersonal({ religion: value }))}
      />
    </>
  );
}
