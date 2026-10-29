import Joi from 'joi';
import { ExportFormat } from '@marriage/shared';
import { biodataContentSchema } from '../biodata/contentSchema';

export const documentExportSchema = Joi.object({
  format: Joi.string()
    .valid(ExportFormat.PDF, ExportFormat.DOCX)
    .required(),
  content: biodataContentSchema.required(),
  fileName: Joi.string().trim().max(80).optional(),
  personName: Joi.string().trim().max(120).optional(),
  designSlug: Joi.string().trim().max(80).optional(),
});
