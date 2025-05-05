import Joi from "joi";

// Custom regex for phone number (simple example)
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const createClientSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Client name is required.",
    }),
  contactPerson: Joi.string()
    .trim()
    .optional()
    .allow(""),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Client email is required.",
    }),
  phone: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Please enter a valid phone number.",
    }),
  billingAddress: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid billing email address.",
      "string.empty": "Billing email address is required.",
    }),
});

export const updateClientSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional(),
  contactPerson: Joi.string()
    .trim()
    .optional()
    .allow(""),
  email: Joi.string()
    .email()
    .optional(),
  phone: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .allow(""),
  billingAddress: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Please enter a valid billing email address.",
    }),
});
