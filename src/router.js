import express from 'express';
import { authRoute } from './lib/auth/router.js';
import { clientRoute } from './lib/client/router.js';
import { projectRoute } from './lib/project/router.js';
import { timesheetRoute } from './lib/timesheet/router.js';
import { invoiceRoute } from './lib/invoice/router.js';
import employeeRoutes from './lib/employee/employeeRoutes/indexRoute.js';
import leaveRoutes from './lib/leave/leaveRoutes/indexRoute.js';
import interviewRoutes from './lib/interview/interviewRoutes/indexRoute.js';
import attendanceRoutes from './lib/attendance/attendanceRoutes/indexRoute.js';
import payrollRoutes from './lib/payroll/payrollRoutes/indexRoute.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/client', clientRoute);
router.use('/project', projectRoute);
router.use('/timesheet', timesheetRoute);
router.use('/invoice', invoiceRoute);

router.use('/employee', employeeRoutes);
router.use('/leave', leaveRoutes);
router.use('/interview', interviewRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/payroll', payrollRoutes);

export default router;
