'use client';

import { MaritalStatus } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchPersonal, toggleHiddenField } from '../../store/biodataSlice';
import { BiodataField } from '../BiodataField';
import { BiodataSelect } from '../BiodataSelect';

export function PersonalStepExtra() {
  const dispatch = useAppDispatch();
  const personal = useAppSelector((state) => state.biodata.content.personal);
  const hidden = useAppSelector((state) => state.biodata.content.hiddenFields);

  return (
    <>
      <BiodataField
        label="Caste"
        name="caste"
        value={personal.caste ?? ''}
        hidden={hidden.includes('personal.caste')}
        onToggleHidden={() => dispatch(toggleHiddenField('personal.caste'))}
        onChange={(value) => dispatch(patchPersonal({ caste: value }))}
      />
      <BiodataField
        label="Mother tongue"
        name="motherTongue"
        value={personal.motherTongue ?? ''}
        onChange={(value) => dispatch(patchPersonal({ motherTongue: value }))}
      />
      <BiodataSelect
        label="Marital status"
        name="maritalStatus"
        value={personal.maritalStatus ?? ''}
        onChange={(value) =>
          dispatch(
            patchPersonal({
              maritalStatus: (value || undefined) as MaritalStatus | undefined,
            }),
          )
        }
        options={[
          { value: MaritalStatus.NEVER_MARRIED, label: 'Never married' },
          { value: MaritalStatus.DIVORCED, label: 'Divorced' },
          { value: MaritalStatus.WIDOWED, label: 'Widowed' },
          { value: MaritalStatus.AWAITING_DIVORCE, label: 'Awaiting divorce' },
        ]}
      />
      <BiodataField
        label="Location"
        name="location"
        value={personal.location ?? ''}
        onChange={(value) => dispatch(patchPersonal({ location: value }))}
      />
    </>
  );
}
