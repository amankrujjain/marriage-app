import Joi from 'joi';
import { TemplateId } from '@marriage/shared';

export const templateIdSchema = Joi.object({
  id: Joi.string()
    .valid(...Object.values(TemplateId))
    .required(),
});
