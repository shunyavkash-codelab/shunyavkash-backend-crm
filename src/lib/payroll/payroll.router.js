import express from 'express';

import { createPayroll } from './controllers/createPayroll.controller.js';
import { getAllPayrolls } from './controllers/getAllPayrolls.controller.js';
import { findPayrollByEmployee } from './controllers/findPayrollByEmployee.controller.js';
import { updatedPayroll } from './controllers/updatedPayroll.controller.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';
import { createPayrollSchema } from './validations/createPayroll.js';
import { updatePayrollSchema } from './validations/updatePayroll.js';

const payrollRoute = express.Router();

payrollRoute.post(
  '/generate',
  validationErrorHandler(createPayrollSchema),
  createPayroll
);
payrollRoute.get('/', getAllPayrolls);
payrollRoute.get('/:employeeId', findPayrollByEmployee);
payrollRoute.patch(
  '/:id/mark-paid',
  validationErrorHandler(updatePayrollSchema),
  updatedPayroll
);

export { payrollRoute };
