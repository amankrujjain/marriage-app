import Joi from 'joi';

export const biodataIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
