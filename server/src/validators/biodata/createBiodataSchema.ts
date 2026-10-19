import Joi from 'joi';
import { biodataContentSchema } from './contentSchema';
import { editorSectionsSchema } from './editorSectionsSchema';

export const createBiodataSchema = Joi.object({
  title: Joi.string().trim().max(120),
  content: biodataContentSchema.required(),
  designSlug: Joi.string().trim().max(80).allow(''),
  editorSections: editorSectionsSchema,
});
