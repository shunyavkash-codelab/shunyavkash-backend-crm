import express from "express";
import {
  checkIn,
  checkOut,
  markLeave,
  getAllAttendance,
  getAttendanceByEmployee,
  deleteAttendance,
} from "../controllers/attendanceController.js";
import authenticate from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/check-in", authenticate, checkIn);
router.post("/check-out", authenticate, checkOut);

// Mark Leave (Admin only)
router.post("/mark-leave", authenticate, authorizeRoles("admin"), markLeave);

//  Get All Attendance Records (Admin only)
router.get("/", authenticate, getAllAttendance);

// Get Attendance by Employee (Admin or Employee viewing their own)
router.get("/:employeeId", authenticate, getAttendanceByEmployee);

// Delete Attendance Record (Admin only)
router.delete("/:id", authenticate, deleteAttendance);

export default router;
