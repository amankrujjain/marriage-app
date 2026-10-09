'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  patchAbout,
  patchCareer,
  patchContact,
  patchEducation,
  patchFamily,
  patchPersonal,
} from '../../store/biodataSlice';
import { EditorAccordion } from './EditorAccordion';
import { EditorField } from './EditorField';
import { EditorPhotoCard } from './EditorPhotoCard';
import { filledCount } from './filledCount';

type SectionKey = 'personal' | 'education' | 'family' | 'about' | 'contact';

export function EditorForm() {
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.biodata.content);
  const [open, setOpen] = useState<SectionKey>('personal');

  function toggle(key: SectionKey) {
    setOpen((prev) => (prev === key ? prev : key));
  }

  const personalCount = filledCount([
    content.personal.fullName,
    content.personal.dateOfBirth,
    content.personal.location,
    content.personal.height,
    content.personal.religion,
    content.personal.caste,
    content.personal.motherTongue,
    content.personal.maritalStatus,
    content.personal.gender,
  ]);

  const educationCount = filledCount([
    content.education.highestEducation,
    content.education.institution,
    content.career.profession,
    content.career.company,
    content.career.income,
  ]);

  const familyCount = filledCount([
    content.family.fatherName,
    content.family.fatherOccupation,
    content.family.motherName,
    content.family.motherOccupation,
    content.family.siblings,
    content.family.familyLocation,
  ]);

  const aboutCount = filledCount([
    content.about.aboutMe,
    content.about.hobbies,
    content.about.lifestyle,
  ]);

  const contactCount = filledCount([
    content.contact.contactName,
    content.contact.phone,
    content.contact.email,
    content.contact.address,
  ]);

  return (
    <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
      <EditorPhotoCard />

      <EditorAccordion
        title="Personal details"
        summary={personalCount.label}
        open={open === 'personal'}
        onToggle={() => toggle('personal')}
      >
        <div className="editor-field-grid">
          <EditorField
            wide
            label="Full name"
            name="fullName"
            value={content.personal.fullName ?? ''}
            onChange={(value) => dispatch(patchPersonal({ fullName: value }))}
          />
          <EditorField
            label="Date of birth"
            name="dateOfBirth"
            type="date"
            value={content.personal.dateOfBirth ?? ''}
            onChange={(value) => dispatch(patchPersonal({ dateOfBirth: value }))}
          />
          <EditorField
            label="Location"
            name="location"
            placeholder="City, State"
            value={content.personal.location ?? ''}
            onChange={(value) => dispatch(patchPersonal({ location: value }))}
          />
          <EditorField
            label="Height"
            name="height"
            placeholder="e.g. 5 ft 4 in"
            value={content.personal.height ?? ''}
            onChange={(value) => dispatch(patchPersonal({ height: value }))}
          />
          <EditorField
            label="Religion"
            name="religion"
            value={content.personal.religion ?? ''}
            onChange={(value) => dispatch(patchPersonal({ religion: value }))}
          />
          <EditorField
            label="Caste / community"
            name="caste"
            hint="optional"
            placeholder="Leave blank to hide"
            value={content.personal.caste ?? ''}
            onChange={(value) => dispatch(patchPersonal({ caste: value }))}
          />
          <EditorField
            label="Mother tongue"
            name="motherTongue"
            hint="optional"
            value={content.personal.motherTongue ?? ''}
            onChange={(value) => dispatch(patchPersonal({ motherTongue: value }))}
          />
        </div>
      </EditorAccordion>

      <EditorAccordion
        title="Education & work"
        summary={`Degree, occupation, income · ${educationCount.label}`}
        open={open === 'education'}
        onToggle={() => toggle('education')}
      >
        <div className="editor-field-grid">
          <EditorField
            label="Highest education"
            name="highestEducation"
            value={content.education.highestEducation ?? ''}
            onChange={(value) => dispatch(patchEducation({ highestEducation: value }))}
          />
          <EditorField
            label="Institution"
            name="institution"
            value={content.education.institution ?? ''}
            onChange={(value) => dispatch(patchEducation({ institution: value }))}
          />
          <EditorField
            label="Profession"
            name="profession"
            value={content.career.profession ?? ''}
            onChange={(value) => dispatch(patchCareer({ profession: value }))}
          />
          <EditorField
            label="Company"
            name="company"
            value={content.career.company ?? ''}
            onChange={(value) => dispatch(patchCareer({ company: value }))}
          />
          <EditorField
            label="Income"
            name="income"
            hint="optional"
            value={content.career.income ?? ''}
            onChange={(value) => dispatch(patchCareer({ income: value }))}
          />
        </div>
      </EditorAccordion>

      <EditorAccordion
        title="Family"
        summary={`Parents, siblings, native place · ${familyCount.label}`}
        open={open === 'family'}
        onToggle={() => toggle('family')}
      >
        <div className="editor-field-grid">
          <EditorField
            label="Father's name"
            name="fatherName"
            value={content.family.fatherName ?? ''}
            onChange={(value) => dispatch(patchFamily({ fatherName: value }))}
          />
          <EditorField
            label="Father's occupation"
            name="fatherOccupation"
            value={content.family.fatherOccupation ?? ''}
            onChange={(value) => dispatch(patchFamily({ fatherOccupation: value }))}
          />
          <EditorField
            label="Mother's name"
            name="motherName"
            value={content.family.motherName ?? ''}
            onChange={(value) => dispatch(patchFamily({ motherName: value }))}
          />
          <EditorField
            label="Mother's occupation"
            name="motherOccupation"
            value={content.family.motherOccupation ?? ''}
            onChange={(value) => dispatch(patchFamily({ motherOccupation: value }))}
          />
          <EditorField
            wide
            label="Siblings"
            name="siblings"
            value={content.family.siblings ?? ''}
            onChange={(value) => dispatch(patchFamily({ siblings: value }))}
          />
          <EditorField
            label="Native / family place"
            name="familyLocation"
            value={content.family.familyLocation ?? ''}
            onChange={(value) => dispatch(patchFamily({ familyLocation: value }))}
          />
        </div>
      </EditorAccordion>

      <EditorAccordion
        title="About"
        summary={`About, hobbies · ${aboutCount.label}`}
        open={open === 'about'}
        onToggle={() => toggle('about')}
      >
        <div className="editor-field-grid">
          <EditorField
            wide
            label="About me"
            name="aboutMe"
            value={content.about.aboutMe ?? ''}
            onChange={(value) => dispatch(patchAbout({ aboutMe: value }))}
          />
          <EditorField
            label="Hobbies"
            name="hobbies"
            value={content.about.hobbies ?? ''}
            onChange={(value) => dispatch(patchAbout({ hobbies: value }))}
          />
          <EditorField
            label="Lifestyle"
            name="lifestyle"
            hint="optional"
            value={content.about.lifestyle ?? ''}
            onChange={(value) => dispatch(patchAbout({ lifestyle: value }))}
          />
        </div>
      </EditorAccordion>

      <EditorAccordion
        title="Contact"
        summary={`Contact person, mobile, address · ${contactCount.label}`}
        open={open === 'contact'}
        onToggle={() => toggle('contact')}
      >
        <div className="editor-field-grid">
          <EditorField
            label="Contact person"
            name="contactName"
            value={content.contact.contactName ?? ''}
            onChange={(value) => dispatch(patchContact({ contactName: value }))}
          />
          <EditorField
            label="Mobile"
            name="phone"
            value={content.contact.phone ?? ''}
            onChange={(value) => dispatch(patchContact({ phone: value }))}
          />
          <EditorField
            label="Email"
            name="email"
            type="email"
            hint="optional"
            value={content.contact.email ?? ''}
            onChange={(value) => dispatch(patchContact({ email: value }))}
          />
          <EditorField
            wide
            label="Address"
            name="address"
            value={content.contact.address ?? ''}
            onChange={(value) => dispatch(patchContact({ address: value }))}
          />
        </div>
      </EditorAccordion>
    </form>
  );
}
