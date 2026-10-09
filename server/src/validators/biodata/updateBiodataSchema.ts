import Joi from 'joi';
import { biodataContentSchema } from './contentSchema';

export const updateBiodataSchema = Joi.object({
  title: Joi.string().trim().max(120),
  content: biodataContentSchema,
}).or('title', 'content');
