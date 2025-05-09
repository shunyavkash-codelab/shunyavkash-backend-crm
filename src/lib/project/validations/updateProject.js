import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';
import { assignedEmployeeSchema } from './assignedEmployee.js';

export const updateProjectSchema = Joi.object({
  client: objectIdValidator().optional(),
  title: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  priority: Joi.string().valid('urgent', 'high', 'normal', 'low').optional(),
  status: Joi.string().valid('pending', 'ongoing', 'completed').optional(),
  assignedEmployees: Joi.array().items(assignedEmployeeSchema).optional(),
  isArchived: Joi.boolean().optional(),
  createdAt: Joi.date().optional()
});
