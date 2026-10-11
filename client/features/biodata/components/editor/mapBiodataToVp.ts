import {
  DEFAULT_BIODATA_BLESSING,
  DEFAULT_BIODATA_HEADER,
  DEFAULT_BIODATA_TAGLINE,
  DEFAULT_BIODATA_TITLE,
  Gender,
  type BiodataContent,
} from '@marriage/shared';
import type { VpSample } from '@/lib/vp/types';
import { resolvePhotoFit } from '../../utils/photoFit';
import type { EditorSectionDef } from './editorSectionModel';

function findField(sections: EditorSectionDef[] | undefined, re: RegExp): string {
  if (!sections) return '';
  for (const section of sections) {
    for (const field of section.fields) {
      if (re.test(field.label) && field.value.trim()) return field.value.trim();
    }
  }
  return '';
}

/** Map app biodata + editor sections into the ui-v1 biodata.js sample shape. */
export function mapBiodataToVp(
  content: BiodataContent,
  sections?: EditorSectionDef[],
): VpSample {
  const personal = content?.personal ?? {};
  const education = content?.education ?? {};
  const career = content?.career ?? {};
  const family = content?.family ?? {};
  const about = content?.about ?? {};
  const contact = content?.contact ?? {};

  const g =
    personal.gender === Gender.MALE
      ? 'M'
      : personal.gender === Gender.FEMALE
        ? 'F'
        : 'F';

  const fit = resolvePhotoFit(content?.profilePhotoFit);

  return {
    name:
      findField(sections, /^full\s*name$/i) ||
      personal.fullName?.trim() ||
      '',
    gender: g,
    dob:
      findField(sections, /date\s*of\s*birth|\bdob\b/i) ||
      personal.dateOfBirth ||
      '',
    tob: findField(sections, /time\s*of\s*birth/i) || '',
    pob:
      findField(sections, /place\s*of\s*birth/i) ||
      personal.location ||
      '',
    height: findField(sections, /^height$/i) || personal.height || '',
    complexion: findField(sections, /complexion/i) || '',
    religion: findField(sections, /^religion$/i) || personal.religion || '',
    caste:
      findField(sections, /caste|community/i) || personal.caste || '',
    gotra: findField(sections, /gotra/i) || '',
    rashi: findField(sections, /rashi/i) || '',
    nakshatra: findField(sections, /nakshatra/i) || '',
    manglik: findField(sections, /manglik/i) || '',
    motherTongue:
      findField(sections, /mother\s*tongue/i) || personal.motherTongue || '',
    marital:
      findField(sections, /marital/i) || personal.maritalStatus || '',
    education:
      findField(sections, /^education$/i) ||
      [education.highestEducation, education.institution]
        .filter(Boolean)
        .join(', ') ||
      '',
    occupation:
      findField(sections, /occupation|profession/i) ||
      career.profession ||
      '',
    company: findField(sections, /company/i) || career.company || '',
    location:
      findField(sections, /work\s*location|^location$/i) ||
      career.workLocation ||
      personal.location ||
      '',
    income: findField(sections, /income/i) || career.income || '',
    diet: findField(sections, /^diet$/i) || '',
    about:
      findField(sections, /about\s*me|^about$/i) || about.aboutMe || '',
    expectations:
      findField(sections, /expectation|partner/i) ||
      about.lifestyle ||
      '',
    father:
      findField(sections, /father'?s?\s*name|^father$/i) ||
      family.fatherName ||
      '',
    fatherOcc:
      findField(sections, /father'?s?\s*occupation/i) ||
      family.fatherOccupation ||
      '',
    mother:
      findField(sections, /mother'?s?\s*name|^mother$/i) ||
      family.motherName ||
      '',
    motherOcc:
      findField(sections, /mother'?s?\s*occupation/i) ||
      family.motherOccupation ||
      '',
    siblings: findField(sections, /sibling/i) || family.siblings || '',
    familyType: findField(sections, /family\s*type/i) || '',
    familyValues: findField(sections, /family\s*values/i) || '',
    native:
      findField(sections, /native/i) || family.familyLocation || '',
    phone: findField(sections, /phone|mobile/i) || contact.phone || '',
    email: findField(sections, /email/i) || contact.email || '',
    address: findField(sections, /address/i) || contact.address || '',
    photo: content?.profilePhotoUrl || '',
    photoZoom: fit.zoom,
    photoX: fit.x,
    photoY: fit.y,
    headerLine: content?.headerLine?.trim() || DEFAULT_BIODATA_HEADER,
    documentTitle: content?.documentTitle?.trim() || DEFAULT_BIODATA_TITLE,
    tagline: content?.tagline?.trim() || DEFAULT_BIODATA_TAGLINE,
    blessing: content?.blessing?.trim() || DEFAULT_BIODATA_BLESSING,
  };
}
