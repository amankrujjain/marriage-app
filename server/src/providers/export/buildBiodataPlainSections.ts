import type { BiodataContent } from '@marriage/shared';

export type PlainSection = { title: string; lines: string[] };

function line(label: string, value?: string | number | null): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text) return null;
  return `${label}: ${text}`;
}

/** Flatten biodata content into titled sections for text PDF / DOCX. */
export function buildBiodataPlainSections(content: BiodataContent): PlainSection[] {
  const hidden = new Set(content.hiddenFields ?? []);
  const field = (
    key: string,
    label: string,
    value?: string | number | null,
  ): string | null => {
    if (hidden.has(key)) return null;
    return line(label, value);
  };

  const p = content.personal ?? {};
  const e = content.education ?? {};
  const c = content.career ?? {};
  const f = content.family ?? {};
  const a = content.about ?? {};
  const k = content.contact ?? {};

  const sections: PlainSection[] = [
    {
      title: 'Personal',
      lines: [
        field('personal.fullName', 'Full name', p.fullName),
        field('personal.gender', 'Gender', p.gender),
        field('personal.dateOfBirth', 'Date of birth', p.dateOfBirth),
        field('personal.age', 'Age', p.age),
        field('personal.height', 'Height', p.height),
        field('personal.religion', 'Religion', p.religion),
        field('personal.caste', 'Caste', p.caste),
        field('personal.motherTongue', 'Mother tongue', p.motherTongue),
        field('personal.maritalStatus', 'Marital status', p.maritalStatus),
        field('personal.location', 'Location', p.location),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Education',
      lines: [
        field('education.highestEducation', 'Highest education', e.highestEducation),
        field('education.institution', 'Institution', e.institution),
        field('education.additionalEducation', 'Additional', e.additionalEducation),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Career',
      lines: [
        field('career.profession', 'Profession', c.profession),
        field('career.company', 'Company', c.company),
        field('career.income', 'Income', c.income),
        field('career.workLocation', 'Work location', c.workLocation),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Family',
      lines: [
        field('family.fatherName', 'Father', f.fatherName),
        field('family.fatherOccupation', 'Father occupation', f.fatherOccupation),
        field('family.motherName', 'Mother', f.motherName),
        field('family.motherOccupation', 'Mother occupation', f.motherOccupation),
        field('family.siblings', 'Siblings', f.siblings),
        field('family.familyLocation', 'Family location', f.familyLocation),
      ].filter(Boolean) as string[],
    },
    {
      title: 'About',
      lines: [
        field('about.aboutMe', 'About', a.aboutMe),
        field('about.hobbies', 'Hobbies', a.hobbies),
        field('about.lifestyle', 'Lifestyle', a.lifestyle),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Contact',
      lines: [
        field('contact.contactName', 'Contact name', k.contactName),
        field('contact.phone', 'Phone', k.phone),
        field('contact.email', 'Email', k.email),
        field('contact.address', 'Address', k.address),
      ].filter(Boolean) as string[],
    },
  ];

  return sections.filter((s) => s.lines.length > 0);
}
