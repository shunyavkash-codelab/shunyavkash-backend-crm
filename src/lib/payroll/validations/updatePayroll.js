import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const updatePayrollSchema = Joi.object({
  employee: objectIdValidator().optional(),
  month: Joi.number().integer().min(1).max(12).optional(),
  year: Joi.number().integer().min(2000).optional(),
  presentDays: Joi.number().min(0).optional(),
  absentDays: Joi.number().min(0).optional(),
  leaveDays: Joi.number().min(0).optional(),
  basicSalary: Joi.number().min(0).optional(),
  bonuses: Joi.number().min(0).optional(),
  deductions: Joi.number().min(0).optional(),
  netSalary: Joi.number().min(0).optional(),
  status: Joi.string().valid('Generated', 'Paid').optional(),
  generatedAt: Joi.date().optional()
});
