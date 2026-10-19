import Joi from 'joi';
import { biodataContentSchema } from './contentSchema';
import { editorSectionsSchema } from './editorSectionsSchema';

export const updateBiodataSchema = Joi.object({
  title: Joi.string().trim().max(120),
  content: biodataContentSchema,
  designSlug: Joi.string().trim().max(80).allow(''),
  editorSections: editorSectionsSchema,
}).or('title', 'content', 'designSlug', 'editorSections');
