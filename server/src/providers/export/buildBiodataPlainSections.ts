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
        line('Full name', p.fullName),
        line('Gender', p.gender),
        line('Date of birth', p.dateOfBirth),
        line('Age', p.age),
        line('Height', p.height),
        line('Religion', p.religion),
        line('Caste', p.caste),
        line('Mother tongue', p.motherTongue),
        line('Marital status', p.maritalStatus),
        line('Location', p.location),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Education',
      lines: [
        line('Highest education', e.highestEducation),
        line('Institution', e.institution),
        line('Additional', e.additionalEducation),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Career',
      lines: [
        line('Profession', c.profession),
        line('Company', c.company),
        line('Income', c.income),
        line('Work location', c.workLocation),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Family',
      lines: [
        line('Father', f.fatherName),
        line('Father occupation', f.fatherOccupation),
        line('Mother', f.motherName),
        line('Mother occupation', f.motherOccupation),
        line('Siblings', f.siblings),
        line('Family location', f.familyLocation),
      ].filter(Boolean) as string[],
    },
    {
      title: 'About',
      lines: [
        line('About', a.aboutMe),
        line('Hobbies', a.hobbies),
        line('Lifestyle', a.lifestyle),
      ].filter(Boolean) as string[],
    },
    {
      title: 'Contact',
      lines: [
        line('Contact name', k.contactName),
        line('Phone', k.phone),
        line('Email', k.email),
        line('Address', k.address),
      ].filter(Boolean) as string[],
    },
  ];

  return sections.filter((s) => s.lines.length > 0);
}
