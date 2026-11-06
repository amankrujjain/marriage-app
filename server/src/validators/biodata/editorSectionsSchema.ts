import Joi from 'joi';

const optionalText = (max: number) =>
  Joi.string().trim().max(max).allow('').empty(null);

const editorFieldSchema = Joi.object({
  id: Joi.string().trim().max(80).required(),
  label: Joi.string().trim().max(120).required(),
  value: Joi.string().allow('').max(2000).empty(null).default(''),
  hint: optionalText(200),
  placeholder: optionalText(200),
  type: optionalText(40),
  wide: Joi.boolean().empty(null),
  sync: optionalText(80),
}).required();

export const editorSectionsSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.string().trim().max(80).required(),
      title: Joi.string().trim().max(120).required(),
      blurb: optionalText(240).default(''),
      custom: Joi.boolean().empty(null),
      fields: Joi.array().items(editorFieldSchema).max(40).required(),
    }),
  )
  .max(30);
