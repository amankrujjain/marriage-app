import Joi from 'joi';
import { biodataContentSchema } from './contentSchema';

export const createBiodataSchema = Joi.object({
  title: Joi.string().trim().max(120),
  content: biodataContentSchema,
});
