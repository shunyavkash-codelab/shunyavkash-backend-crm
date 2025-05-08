import express from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import authorizeRoles from '../../middlewares/role.middleware.js';
import { checkIn } from './controllers/checkIn.controller.js';
import { checkOut } from './controllers/checkOut.controller.js';
import { markLeave } from './controllers/markLeave.controller.js';
import { getAllAttendance } from './controllers/getAllAttendance.controller.js';
import { findAttendanceByEmployee } from './controllers/findAttendanceByEmployee.controller.js';
import { deleteAttendance } from './controllers/deleteAttendance.controller.js';

const attendanceRoute = express.Router();

attendanceRoute.post('/check-in', auth, checkIn);
attendanceRoute.post('/check-out', auth, checkOut);

// Mark Leave (Admin only)
attendanceRoute.post('/mark-leave', auth, authorizeRoles('admin'), markLeave);

//  Get All Attendance Records (Admin only)
attendanceRoute.get('/', auth, getAllAttendance);

// Get Attendance by Employee (Admin or Employee viewing their own)
attendanceRoute.get('/:employeeId', auth, findAttendanceByEmployee);

// Delete Attendance Record (Admin only)
attendanceRoute.delete('/:id', auth, deleteAttendance);

export { attendanceRoute };
