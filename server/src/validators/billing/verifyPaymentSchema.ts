import Joi from 'joi';

export const verifyPaymentSchema = Joi.object({
  providerOrderId: Joi.string().trim().required(),
  providerPaymentId: Joi.string().trim().required(),
  signature: Joi.string().trim().required(),
});
