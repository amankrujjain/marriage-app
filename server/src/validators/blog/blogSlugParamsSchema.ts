import Joi from 'joi';

export const blogSlugParamsSchema = Joi.object({
  slug: Joi.string()
    .trim()
    .lowercase()
    .max(200)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
});
