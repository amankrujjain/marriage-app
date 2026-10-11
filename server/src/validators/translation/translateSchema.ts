import Joi from 'joi';
import { LanguageCode } from '@marriage/shared';

const language = Joi.string().valid(...Object.values(LanguageCode));

export const translateFieldsSchema = Joi.object({
  fields: Joi.object().pattern(Joi.string().max(80), Joi.string().max(1000)).required(),
  targetLanguage: language.required(),
  sourceLanguage: language.optional(),
});

export const translateBiodataSchema = Joi.object({
  content: Joi.object({
    personal: Joi.object().unknown(true).default({}),
    education: Joi.object().unknown(true).default({}),
    career: Joi.object().unknown(true).default({}),
    family: Joi.object().unknown(true).default({}),
    about: Joi.object().unknown(true).default({}),
    contact: Joi.object().unknown(true).default({}),
    profilePhotoUrl: Joi.string().allow('').optional(),
    profilePhotoFit: Joi.object({
      x: Joi.number().min(0).max(100).required(),
      y: Joi.number().min(0).max(100).required(),
      zoom: Joi.number().min(1).max(2.5).required(),
    }).optional(),
    hiddenFields: Joi.array().items(Joi.string()).default([]),
  }).required(),
  targetLanguage: language.required(),
  sourceLanguage: language.optional(),
});
