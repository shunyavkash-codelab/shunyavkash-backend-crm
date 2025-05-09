import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const updateTimesheetSchema = Joi.object({
  user: objectIdValidator().optional(),
  employee: objectIdValidator().optional().messages({
    'any.invalid': 'Invalid Employee ID.'
  }),
  project: objectIdValidator().optional(),
  date: Joi.date().optional(),
  hoursWorked: Joi.number().min(0).optional().messages({
    'number.min': 'Hours worked cannot be negative.'
  }),
  description: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
  isFinalized: Joi.boolean().optional(),
  createdAt: Joi.date().optional()
});
