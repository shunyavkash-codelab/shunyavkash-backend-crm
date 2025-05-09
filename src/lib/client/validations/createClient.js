import Joi from 'joi';

export const createClientSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Client name is required.'
  }),
  contactPerson: Joi.string().trim().optional().allow(''),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Client email is required.'
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please enter a valid phone number.'
    }),
  billingAddress: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid billing email address.',
    'string.empty': 'Billing email address is required.'
  })
});
