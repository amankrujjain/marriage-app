'use client';

import { Gender } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchPersonal } from '../../store/biodataSlice';

export function EditorGenderRow() {
  const dispatch = useAppDispatch();
  const gender = useAppSelector((state) => state.biodata.content.personal.gender);

  return (
    <div className="frow">
      <label>Biodata for</label>
      <div className="grp" style={{ gridTemplateColumns: 'auto auto 1fr', gap: 18 }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
          <input
            type="radio"
            name="biodata-gender"
            value="F"
            checked={gender !== Gender.MALE}
            onChange={() => dispatch(patchPersonal({ gender: Gender.FEMALE }))}
          />
          Bride
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
          <input
            type="radio"
            name="biodata-gender"
            value="M"
            checked={gender === Gender.MALE}
            onChange={() => dispatch(patchPersonal({ gender: Gender.MALE }))}
          />
          Groom
        </label>
        <span />
      </div>
    </div>
  );
}
