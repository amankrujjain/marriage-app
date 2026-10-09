import Joi from 'joi';

export const registerFormSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required().messages({
    'string.min': 'Name should be at least 2 characters',
  }),
  email: Joi.string().trim().email({ tlds: false }).required().messages({
    'string.email': 'Enter a valid email',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
  phone: Joi.string()
    .trim()
    .allow('')
    .pattern(/^[0-9+\-\s]{8,20}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Enter a valid phone number',
    }),
});
