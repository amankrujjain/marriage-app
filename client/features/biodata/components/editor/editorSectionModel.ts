export type EditorFieldDef = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  wide?: boolean;
  /** Dot path into biodata content, e.g. personal.fullName */
  sync?: string;
};

export type EditorSectionDef = {
  id: string;
  title: string;
  blurb: string;
  fields: EditorFieldDef[];
  custom?: boolean;
};

function fid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createField(partial?: Partial<EditorFieldDef>): EditorFieldDef {
  return {
    id: partial?.id ?? fid('f'),
    label: partial?.label ?? 'New field',
    value: partial?.value ?? '',
    hint: partial?.hint,
    placeholder: partial?.placeholder ?? 'Leave blank to hide',
    type: partial?.type ?? 'text',
    wide: partial?.wide,
    sync: partial?.sync,
  };
}

export function createSection(title = 'New section'): EditorSectionDef {
  return {
    id: fid('s'),
    title,
    blurb: 'Custom section',
    custom: true,
    fields: [createField({ label: 'New field' })],
  };
}

export const DEFAULT_EDITOR_SECTIONS: EditorSectionDef[] = [
  {
    id: 'personal',
    title: 'Personal details',
    blurb: 'Name, birth, height, religion',
    fields: [
      createField({
        id: 'personal-fullName',
        label: 'Full name',
        sync: 'personal.fullName',
        wide: true,
        placeholder: '',
      }),
      createField({
        id: 'personal-dob',
        label: 'Date of birth',
        sync: 'personal.dateOfBirth',
        type: 'date',
        placeholder: 'DD / MM / YYYY',
      }),
      createField({
        id: 'personal-location',
        label: 'Place of birth',
        sync: 'personal.location',
        placeholder: 'City, State',
      }),
      createField({
        id: 'personal-height',
        label: 'Height',
        sync: 'personal.height',
        placeholder: 'Select height',
      }),
      createField({
        id: 'personal-religion',
        label: 'Religion',
        sync: 'personal.religion',
        placeholder: '',
      }),
      createField({
        id: 'personal-caste',
        label: 'Caste / community',
        sync: 'personal.caste',
        hint: 'optional',
      }),
      createField({
        id: 'personal-motherTongue',
        label: 'Mother tongue',
        sync: 'personal.motherTongue',
        hint: 'optional',
      }),
      createField({
        id: 'personal-complexion',
        label: 'Complexion',
        hint: 'optional',
      }),
    ],
  },
  {
    id: 'horoscope',
    title: 'Horoscope',
    blurb: 'Gotra, Rashi, Nakshatra, Manglik',
    fields: [
      createField({ id: 'horo-gotra', label: 'Gotra', placeholder: '' }),
      createField({ id: 'horo-rashi', label: 'Rashi', placeholder: '' }),
      createField({ id: 'horo-nakshatra', label: 'Nakshatra', placeholder: '' }),
      createField({ id: 'horo-manglik', label: 'Manglik', placeholder: 'Yes / No' }),
    ],
  },
  {
    id: 'education',
    title: 'Education & work',
    blurb: 'Degree, occupation, income',
    fields: [
      createField({
        id: 'edu-highest',
        label: 'Education',
        sync: 'education.highestEducation',
        placeholder: '',
      }),
      createField({
        id: 'edu-institution',
        label: 'Institution',
        sync: 'education.institution',
        placeholder: '',
      }),
      createField({
        id: 'career-profession',
        label: 'Occupation',
        sync: 'career.profession',
        placeholder: '',
      }),
      createField({
        id: 'career-company',
        label: 'Company',
        sync: 'career.company',
        placeholder: '',
      }),
      createField({
        id: 'career-income',
        label: 'Annual income',
        sync: 'career.income',
        hint: 'optional',
      }),
    ],
  },
  {
    id: 'family',
    title: 'Family',
    blurb: 'Parents, siblings, native place',
    fields: [
      createField({
        id: 'family-father',
        label: 'Father',
        sync: 'family.fatherName',
        placeholder: '',
      }),
      createField({
        id: 'family-father-occ',
        label: "Father's occupation",
        sync: 'family.fatherOccupation',
        placeholder: '',
      }),
      createField({
        id: 'family-mother',
        label: 'Mother',
        sync: 'family.motherName',
        placeholder: '',
      }),
      createField({
        id: 'family-mother-occ',
        label: "Mother's occupation",
        sync: 'family.motherOccupation',
        placeholder: '',
      }),
      createField({
        id: 'family-siblings',
        label: 'Siblings',
        sync: 'family.siblings',
        wide: true,
        placeholder: '',
      }),
      createField({
        id: 'family-place',
        label: 'Native place',
        sync: 'family.familyLocation',
        placeholder: '',
      }),
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    blurb: 'Contact person, mobile, address',
    fields: [
      createField({
        id: 'contact-name',
        label: 'Contact person',
        sync: 'contact.contactName',
        placeholder: '',
      }),
      createField({
        id: 'contact-phone',
        label: 'Mobile',
        sync: 'contact.phone',
        placeholder: '',
      }),
      createField({
        id: 'contact-email',
        label: 'Email',
        sync: 'contact.email',
        type: 'email',
        hint: 'optional',
      }),
      createField({
        id: 'contact-address',
        label: 'Address',
        sync: 'contact.address',
        wide: true,
        placeholder: '',
      }),
    ],
  },
];

export const EDITOR_SECTIONS_KEY = 'vivah-editor-sections-v1';

export function countFilled(fields: EditorFieldDef[]): { filled: number; total: number; label: string } {
  const total = fields.length;
  const filled = fields.filter((f) => f.value.trim()).length;
  return { filled, total, label: `${filled} of ${total} filled` };
}
