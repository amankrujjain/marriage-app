import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s]{8,20}$/)
    .optional(),
});
