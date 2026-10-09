import Joi from 'joi';
import { ExportFormat } from '@marriage/shared';

export const exportSchema = Joi.object({
  format: Joi.string()
    .valid(...Object.values(ExportFormat))
    .required(),
  imageBase64: Joi.string().min(64).required(),
  fileName: Joi.string().trim().max(80).optional(),
  personName: Joi.string().trim().max(120).optional(),
});
