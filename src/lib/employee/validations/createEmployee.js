import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  avatar: Joi.string().optional().allow(''),
  avatarPublicId: Joi.string().optional().allow(''),
  firstName: Joi.string().trim().required().messages({
    'string.empty': 'First name is required.'
  }),
  lastName: Joi.string().trim().optional().allow(''),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.'
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please enter a valid phone number.'
    }),
  designation: Joi.array().items(Joi.string()).optional().default([]),
  department: Joi.array().items(Joi.string()).optional().default([]),
  dateOfJoining: Joi.date().optional(),
  salary: Joi.number().optional().min(0).messages({
    'number.min': 'Salary must be a positive number.'
  }),
  status: Joi.string()
    .valid('Active', 'Inactive', 'Terminated')
    .optional()
    .default('Active'),
  address: Joi.string().optional().allow(''),
  documents: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional().allow(''),
        url: Joi.string().optional().allow(''),
        publicId: Joi.string().optional().allow('')
      })
    )
    .optional()
});
