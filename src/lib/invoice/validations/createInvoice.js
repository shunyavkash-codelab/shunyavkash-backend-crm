import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const createInvoiceSchema = Joi.object({
  client: objectIdValidator().required().messages({
    'any.required': 'Client ID is required.'
  }),
  timesheets: Joi.array()
    .items(objectIdValidator().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'Timesheets must be an array of valid IDs.',
      'array.min': 'At least one timesheet must be selected.'
    }),
  totalHours: Joi.number().positive().required().messages({
    'number.base': 'Total hours must be a number.',
    'number.positive': 'Total hours must be greater than 0.'
  }),
  ratePerHour: Joi.number().positive().required().messages({
    'number.base': 'Rate per hour must be a number.',
    'number.positive': 'Rate per hour must be greater than 0.'
  }),
  totalAmount: Joi.number().positive().required().messages({
    'number.base': 'Total amount must be a number.',
    'number.positive': 'Total amount must be greater than 0.'
  }),
  issuedDate: Joi.date().optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('Unpaid', 'Paid').optional()
});
