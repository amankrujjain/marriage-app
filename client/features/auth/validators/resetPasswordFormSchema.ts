import Joi from 'joi';
import { PASSWORD_HINT, PASSWORD_PATTERN } from '@marriage/shared';

export const resetPasswordFormSchema = Joi.object({
  password: Joi.string()
    .pattern(PASSWORD_PATTERN)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_HINT,
      'string.empty': PASSWORD_HINT,
      'any.required': PASSWORD_HINT,
    }),
  confirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm your password',
  }),
});
