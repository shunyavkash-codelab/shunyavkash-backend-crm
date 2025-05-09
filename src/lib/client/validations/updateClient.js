import Joi from 'joi';

export const updateClientSchema = Joi.object({
  name: Joi.string().trim().optional(),
  contactPerson: Joi.string().trim().optional().allow(''),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .allow(''),
  billingAddress: Joi.string().email().optional().messages({
    'string.email': 'Please enter a valid billing email address.'
  })
});
