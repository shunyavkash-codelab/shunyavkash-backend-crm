import Joi from "joi";

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
    .trim()
    .optional()
    .allow(""),

  address: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Client address is required.",
    }),

  currency: Joi.string()
    .valid("USD", "EUR", "INR", "GBP", "AUD")
    .default("USD")
    .messages({
      "any.only": "Currency must be one of USD, EUR, INR, GBP, or AUD.",
    }),

  industry: Joi.string()
    .valid("IT", "Healthcare", "Education", "Finance", "Retail", "Other")
    .required()
    .messages({
      "any.only": "Industry must be a valid option.",
      "string.empty": "Industry is required.",
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
    .allow("")
    .messages({
      "string.pattern.base": "Please enter a valid phone number.",
    }),

  billingAddress: Joi.string()
    .trim()
    .optional()
    .allow(""),

  address: Joi.string()
    .trim()
    .optional(),

  currency: Joi.string()
    .valid("USD", "EUR", "INR", "GBP", "AUD")
    .optional(),

  industry: Joi.string()
    .valid("IT", "Healthcare", "Education", "Finance", "Retail", "Other")
    .optional(),
});
