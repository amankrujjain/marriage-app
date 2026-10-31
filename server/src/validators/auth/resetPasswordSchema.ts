import Joi from 'joi';
import { PASSWORD_HINT, PASSWORD_PATTERN } from '@marriage/shared';

export const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().min(20).max(200).required(),
  password: Joi.string()
    .pattern(PASSWORD_PATTERN)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_HINT,
      'string.empty': PASSWORD_HINT,
      'any.required': PASSWORD_HINT,
    }),
});
