import Joi from 'joi';

export const listBlogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  excludeSlug: Joi.string()
    .trim()
    .lowercase()
    .max(200)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
