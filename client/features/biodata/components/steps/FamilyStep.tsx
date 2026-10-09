'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchFamily } from '../../store/biodataSlice';
import { BiodataField } from '../BiodataField';

export function FamilyStep() {
  const dispatch = useAppDispatch();
  const family = useAppSelector((state) => state.biodata.content.family);

  return (
    <div className="flex flex-col gap-4">
      <BiodataField
        label="Father's name"
        name="fatherName"
        value={family.fatherName ?? ''}
        onChange={(value) => dispatch(patchFamily({ fatherName: value }))}
      />
      <BiodataField
        label="Father's occupation"
        name="fatherOccupation"
        value={family.fatherOccupation ?? ''}
        onChange={(value) => dispatch(patchFamily({ fatherOccupation: value }))}
      />
      <BiodataField
        label="Mother's name"
        name="motherName"
        value={family.motherName ?? ''}
        onChange={(value) => dispatch(patchFamily({ motherName: value }))}
      />
      <BiodataField
        label="Mother's occupation"
        name="motherOccupation"
        value={family.motherOccupation ?? ''}
        onChange={(value) => dispatch(patchFamily({ motherOccupation: value }))}
      />
      <BiodataField
        label="Siblings"
        name="siblings"
        value={family.siblings ?? ''}
        onChange={(value) => dispatch(patchFamily({ siblings: value }))}
      />
      <BiodataField
        label="Family location"
        name="familyLocation"
        value={family.familyLocation ?? ''}
        onChange={(value) => dispatch(patchFamily({ familyLocation: value }))}
      />
    </div>
  );
}
