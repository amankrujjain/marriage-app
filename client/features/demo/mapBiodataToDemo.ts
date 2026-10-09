import type { BiodataContent } from '@marriage/shared';
import { TemplateId } from '@marriage/shared';
import type { DemoState, DemoTpl } from './demoTypes';

function tplFromTemplateId(id: TemplateId): DemoTpl {
  switch (id) {
    case TemplateId.ROYAL_GOLD:
      return 'panna';
    case TemplateId.MODERN_CLEAN:
    case TemplateId.MINIMAL_LINE:
      return 'kagaz';
    case TemplateId.FLORAL_SOFT:
    case TemplateId.ELEGANT_SERIF:
    case TemplateId.TRADITIONAL_MAROON:
    default:
      return 'zari';
  }
}

function row(label: string, value?: string): { label: string; value: string } | null {
  if (!value?.trim()) return null;
  return { label, value: value.trim() };
}

export function mapBiodataToDemo(
  content: BiodataContent,
  templateId: TemplateId,
  options?: { mantra?: string; docTitle?: string },
): DemoState {
  const personal = [
    row('Date of Birth', content.personal.dateOfBirth),
    row('Height', content.personal.height),
    row('Religion', content.personal.religion),
    row('Caste', content.personal.caste),
    row('Mother Tongue', content.personal.motherTongue),
    row('Location', content.personal.location),
    row(
      'Education',
      [content.education.highestEducation, content.education.institution]
        .filter(Boolean)
        .join(', ') || undefined,
    ),
    row(
      'Occupation',
      [content.career.profession, content.career.company].filter(Boolean).join(', ') || undefined,
    ),
    row('Income', content.career.income),
    row('Hobbies', content.about.hobbies),
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const family = [
    row(
      'Father',
      [content.family.fatherName, content.family.fatherOccupation].filter(Boolean).join(', ') ||
        undefined,
    ),
    row(
      'Mother',
      [content.family.motherName, content.family.motherOccupation].filter(Boolean).join(', ') ||
        undefined,
    ),
    row('Siblings', content.family.siblings),
    row('Native Place', content.family.familyLocation),
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const contact = [
    row('Contact Person', content.contact.contactName),
    row('Mobile', content.contact.phone),
    row('Email', content.contact.email),
    row('Address', content.contact.address),
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return {
    tpl: tplFromTemplateId(templateId),
    mantra: options?.mantra ?? '॥ श्री गणेशाय नमः ॥',
    docTitle: options?.docTitle ?? 'Marriage Biodata',
    name: content.personal.fullName?.trim() || 'Your Name',
    photo: content.profilePhotoUrl ?? '',
    sections: [
      { title: 'Personal Details', fields: personal },
      { title: 'Family Details', fields: family },
      { title: 'Contact Details', fields: contact },
    ],
  };
}
