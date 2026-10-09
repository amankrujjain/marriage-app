import Joi from 'joi';

export const healthQuerySchema = Joi.object({
  deep: Joi.boolean().truthy('true').falsy('false').default(false),
});
