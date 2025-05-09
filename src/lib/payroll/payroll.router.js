import express from 'express';

import { createPayroll } from './controllers/createPayroll.controller.js';
import { getAllPayrolls } from './controllers/getAllPayrolls.controller.js';
import { findPayrollByEmployee } from './controllers/findPayrollByEmployee.controller.js';
import { updatedPayroll } from './controllers/updatedPayroll.controller.js';

const payrollRoute = express.Router();

payrollRoute.post('/generate', createPayroll);
payrollRoute.get('/', getAllPayrolls);
payrollRoute.get('/:employeeId', findPayrollByEmployee);
payrollRoute.patch('/:id/mark-paid', updatedPayroll);

export { payrollRoute };
