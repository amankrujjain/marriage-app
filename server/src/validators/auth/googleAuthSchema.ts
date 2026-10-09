import Joi from 'joi';

export const googleAuthSchema = Joi.object({
  idToken: Joi.string().min(20).required(),
});
