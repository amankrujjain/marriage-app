import Joi from 'joi';

export const updateTemplateSchema = Joi.object({
  tier: Joi.string().valid('Free', 'Premium'),
  cat: Joi.string().valid('Traditional', 'Royal', 'Floral', 'Modern'),
  active: Joi.boolean(),
  name: Joi.string().trim().max(80),
  blurb: Joi.string().trim().max(400).allow(''),
  faith: Joi.array()
    .items(Joi.string().valid('Hindu', 'Muslim', 'Sikh', 'Christian'))
    .min(1)
    .max(4),
}).min(1);

export const templateSlugParamsSchema = Joi.object({
  slug: Joi.string().trim().min(2).max(80).required(),
});
