import Joi from 'joi';
import { ExportFormat } from '@marriage/shared';

export const exportSchema = Joi.object({
  format: Joi.string()
    .valid(...Object.values(ExportFormat))
    .required(),
  // ~4MB binary ≈ 5.5M base64 chars; blocks oversized sharp work.
  imageBase64: Joi.string().min(64).max(5_500_000).required(),
  fileName: Joi.string().trim().max(80).optional(),
  personName: Joi.string().trim().max(120).optional(),
  designSlug: Joi.string().trim().max(80).optional(),
});
