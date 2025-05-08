import express from 'express';
import { authRoute } from './lib/auth/router.js';
import { clientRoute } from './lib/client/router.js';
import { projectRoute } from './lib/project/router.js';
import { timesheetRoute } from './lib/timesheet/router.js';
import { invoiceRoute } from './lib/invoice/router.js';
import { employeeRoute } from './lib/employee/router.js';
import { leaveRoute } from './lib/leave/router.js';
import { interviewRoute } from './lib/interview/router.js';
import { attendanceRoute } from './lib/attendance/router.js';
import payrollRoutes from './lib/payroll/payrollRoutes/indexRoute.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/client', clientRoute);
router.use('/project', projectRoute);
router.use('/timesheet', timesheetRoute);
router.use('/invoice', invoiceRoute);
router.use('/employee', employeeRoute);
router.use('/leave', leaveRoute);
router.use('/interview', interviewRoute);
router.use('/attendance', attendanceRoute);

router.use('/payroll', payrollRoutes);

export default router;
