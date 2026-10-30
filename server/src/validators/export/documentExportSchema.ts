import Joi from 'joi';
import { ExportFormat } from '@marriage/shared';
import { biodataContentSchema } from '../biodata/contentSchema';

const extraSectionLineSchema = Joi.object({
  label: Joi.string().trim().max(80).required(),
  value: Joi.string().trim().max(500).required(),
});

const extraSectionSchema = Joi.object({
  title: Joi.string().trim().max(80).required(),
  lines: Joi.array().items(extraSectionLineSchema).max(30).required(),
});

export const documentExportSchema = Joi.object({
  format: Joi.string()
    .valid(ExportFormat.PDF, ExportFormat.DOCX)
    .required(),
  content: biodataContentSchema.required(),
  fileName: Joi.string().trim().max(80).optional(),
  personName: Joi.string().trim().max(120).optional(),
  designSlug: Joi.string().trim().max(80).optional(),
  extraSections: Joi.array().items(extraSectionSchema).max(12).optional(),
});
