import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const updateLeaveSchema = Joi.object({
  employee: objectIdValidator().optional(),
  leaveType: Joi.string().valid('Sick', 'Paid', 'Other').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  reason: Joi.string().optional().allow(''),
  status: Joi.string().valid('Pending', 'Approved', 'Rejected').optional()
});
