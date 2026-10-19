import Joi from 'joi';

const editorFieldSchema = Joi.object({
  id: Joi.string().trim().max(80).required(),
  label: Joi.string().trim().max(120).required(),
  value: Joi.string().allow('').max(2000).required(),
  hint: Joi.string().trim().max(200).allow(''),
  placeholder: Joi.string().trim().max(200).allow(''),
  type: Joi.string().trim().max(40).allow(''),
  wide: Joi.boolean(),
  sync: Joi.string().trim().max(80).allow(''),
}).required();

export const editorSectionsSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.string().trim().max(80).required(),
      title: Joi.string().trim().max(120).required(),
      blurb: Joi.string().trim().max(240).allow(''),
      custom: Joi.boolean(),
      fields: Joi.array().items(editorFieldSchema).max(40).required(),
    }),
  )
  .max(30);
