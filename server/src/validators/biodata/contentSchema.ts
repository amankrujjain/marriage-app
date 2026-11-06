import Joi from 'joi';
import { Gender, MaritalStatus } from '@marriage/shared';
import { isAllowedProfilePhotoUrl } from '../../utils/profilePhotoUrlRule';

const optionalString = (max: number) =>
  Joi.string().trim().max(max).allow('').empty(null);

/** Accept ISO or DD/MM/YYYY (and spaced variants); store YYYY-MM-DD or ''. */
const dateOfBirthSchema = Joi.string()
  .allow('')
  .empty(null)
  .max(40)
  .custom((value, helpers) => {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

    const dmy = raw.match(/^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{2}|\d{4})$/);
    if (dmy) {
      let year = Number(dmy[3]);
      if (year < 100) year += year >= 50 ? 1900 : 2000;
      const day = String(dmy[1]).padStart(2, '0');
      const month = String(dmy[2]).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return helpers.error('any.invalid');
  })
  .messages({ 'any.invalid': 'dateOfBirth must be a valid date' });

const personalSchema = Joi.object({
  fullName: optionalString(120),
  gender: Joi.string()
    .empty(null)
    .custom((value) => {
      const v = String(value ?? '').trim().toLowerCase();
      if (!v) return '';
      if ((Object.values(Gender) as string[]).includes(v)) return v;
      // Drafts may briefly hold display labels; ignore unknowns.
      return '';
    }),
  dateOfBirth: dateOfBirthSchema,
  // Draft saves may send ""; treat empty as absent.
  age: Joi.number().integer().min(18).max(100).empty(['', null]).optional(),
  height: optionalString(40),
  religion: optionalString(80),
  caste: optionalString(80),
  motherTongue: optionalString(80),
  maritalStatus: Joi.string()
    .empty(null)
    .custom((value) => {
      const v = String(value ?? '').trim().toLowerCase();
      if (!v) return '';
      if ((Object.values(MaritalStatus) as string[]).includes(v)) return v;
      return '';
    }),
  location: optionalString(160),
})
  .unknown(false)
  .default({});

export const biodataContentSchema = Joi.object({
  personal: personalSchema,
  education: Joi.object({
    highestEducation: optionalString(120),
    institution: optionalString(160),
    additionalEducation: optionalString(200),
  })
    .unknown(false)
    .default({}),
  career: Joi.object({
    profession: optionalString(120),
    company: optionalString(120),
    income: optionalString(80),
    workLocation: optionalString(160),
  })
    .unknown(false)
    .default({}),
  family: Joi.object({
    fatherName: optionalString(120),
    fatherOccupation: optionalString(120),
    motherName: optionalString(120),
    motherOccupation: optionalString(120),
    siblings: optionalString(200),
    familyLocation: optionalString(160),
  })
    .unknown(false)
    .default({}),
  about: Joi.object({
    aboutMe: optionalString(1000),
    hobbies: optionalString(400),
    lifestyle: optionalString(400),
  })
    .unknown(false)
    .default({}),
  contact: Joi.object({
    contactName: optionalString(120),
    phone: optionalString(20),
    // Soft: drafts may contain partial emails while typing.
    email: optionalString(160),
    address: optionalString(300),
  })
    .unknown(false)
    .default({}),
  profilePhotoUrl: Joi.string()
    .allow('')
    .empty(null)
    .max(2_500_000)
    .custom((value, helpers) => {
      if (value === '' || isAllowedProfilePhotoUrl(value)) return value;
      return helpers.error('any.invalid');
    })
    .messages({
      'any.invalid':
        'profilePhotoUrl must be a site media URL or image data URL',
    }),
  profilePhotoFit: Joi.object({
    x: Joi.number().min(0).max(100).required(),
    y: Joi.number().min(0).max(100).required(),
    zoom: Joi.number().min(1).max(2.5).required(),
  }).optional(),
  headerLine: optionalString(120),
  documentTitle: optionalString(120),
  tagline: optionalString(200),
  blessing: optionalString(200),
  designSlug: Joi.string().trim().max(80).allow('').empty(null),
  hiddenFields: Joi.array().items(Joi.string().max(80)).default([]),
})
  .unknown(false)
  .required();
