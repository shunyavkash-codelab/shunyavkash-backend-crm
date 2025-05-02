import express from 'express';
import {
  checkIn,
  checkOut,
  markLeave,
  getAllAttendance,
  getAttendanceByEmployee,
  deleteAttendance
} from '../controllers/attendanceController.js';
import { auth } from '../../../middlewares/auth.middleware.js';
import authorizeRoles from '../../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/check-in', auth, checkIn);
router.post('/check-out', auth, checkOut);

// Mark Leave (Admin only)
router.post('/mark-leave', auth, authorizeRoles('admin'), markLeave);

//  Get All Attendance Records (Admin only)
router.get('/', auth, getAllAttendance);

// Get Attendance by Employee (Admin or Employee viewing their own)
router.get('/:employeeId', auth, getAttendanceByEmployee);

// Delete Attendance Record (Admin only)
router.delete('/:id', auth, deleteAttendance);

export default router;
