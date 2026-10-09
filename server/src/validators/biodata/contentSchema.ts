import Joi from 'joi';
import { Gender, MaritalStatus } from '@marriage/shared';

const optionalString = (max: number) => Joi.string().trim().max(max).allow('');

const personalSchema = Joi.object({
  fullName: optionalString(120),
  gender: Joi.string().valid(...Object.values(Gender)).allow(''),
  dateOfBirth: Joi.string().isoDate().allow(''),
  age: Joi.number().integer().min(18).max(100),
  height: optionalString(40),
  religion: optionalString(80),
  caste: optionalString(80),
  motherTongue: optionalString(80),
  maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)).allow(''),
  location: optionalString(160),
}).default({});

export const biodataContentSchema = Joi.object({
  personal: personalSchema,
  education: Joi.object({
    highestEducation: optionalString(120),
    institution: optionalString(160),
    additionalEducation: optionalString(200),
  }).default({}),
  career: Joi.object({
    profession: optionalString(120),
    company: optionalString(120),
    income: optionalString(80),
    workLocation: optionalString(160),
  }).default({}),
  family: Joi.object({
    fatherName: optionalString(120),
    fatherOccupation: optionalString(120),
    motherName: optionalString(120),
    motherOccupation: optionalString(120),
    siblings: optionalString(200),
    familyLocation: optionalString(160),
  }).default({}),
  about: Joi.object({
    aboutMe: optionalString(1000),
    hobbies: optionalString(400),
    lifestyle: optionalString(400),
  }).default({}),
  contact: Joi.object({
    contactName: optionalString(120),
    phone: optionalString(20),
    email: Joi.string().trim().email({ tlds: false }).allow(''),
    address: optionalString(300),
  }).default({}),
  profilePhotoUrl: Joi.string().uri({ allowRelative: true }).allow(''),
  hiddenFields: Joi.array().items(Joi.string().max(80)).default([]),
}).required();
