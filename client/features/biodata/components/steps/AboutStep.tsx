'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchAbout } from '../../store/biodataSlice';
import { BiodataTextArea } from '../BiodataTextArea';
import { BiodataField } from '../BiodataField';

export function AboutStep() {
  const dispatch = useAppDispatch();
  const about = useAppSelector((state) => state.biodata.content.about);

  return (
    <div className="flex flex-col gap-4">
      <BiodataTextArea
        label="About me"
        name="aboutMe"
        value={about.aboutMe ?? ''}
        onChange={(value) => dispatch(patchAbout({ aboutMe: value }))}
      />
      <BiodataField
        label="Hobbies"
        name="hobbies"
        value={about.hobbies ?? ''}
        onChange={(value) => dispatch(patchAbout({ hobbies: value }))}
      />
      <BiodataField
        label="Lifestyle"
        name="lifestyle"
        value={about.lifestyle ?? ''}
        onChange={(value) => dispatch(patchAbout({ lifestyle: value }))}
      />
    </div>
  );
}
