import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const assignedEmployeeSchema = Joi.object({
  employee: objectIdValidator().required().messages({
    'any.required': 'Employee ID is required for assignment.',
    'any.invalid': 'Invalid Employee ID.'
  }),
  role: Joi.string().allow('').optional()
});
