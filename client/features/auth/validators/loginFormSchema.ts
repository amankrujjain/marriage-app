import Joi from 'joi';

export const loginFormSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: false }).required().messages({
    'string.email': 'Enter a valid email',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
});
