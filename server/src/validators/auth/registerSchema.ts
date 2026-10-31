import Joi from 'joi';
import { PASSWORD_HINT, PASSWORD_PATTERN } from '@marriage/shared';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string()
    .pattern(PASSWORD_PATTERN)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_HINT,
      'string.empty': PASSWORD_HINT,
      'any.required': PASSWORD_HINT,
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s]{8,20}$/)
    .optional(),
});
