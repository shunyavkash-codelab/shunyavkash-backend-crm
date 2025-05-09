import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const updateInvoiceSchema = Joi.object({
  client: objectIdValidator().optional(),
  timesheets: Joi.array().items(objectIdValidator().required()).optional(),
  totalHours: Joi.number().positive().optional(),
  ratePerHour: Joi.number().positive().optional(),
  totalAmount: Joi.number().positive().optional(),
  issuedDate: Joi.date().optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('Unpaid', 'Paid').optional(),
  pdfExists: Joi.boolean().optional(),
  pdfUrl: Joi.string().uri().optional(),
  cloudinaryPublicId: Joi.string().optional(),
  pdfGeneratedAt: Joi.date().optional(),
  pdfVersion: Joi.number().integer().optional()
});
