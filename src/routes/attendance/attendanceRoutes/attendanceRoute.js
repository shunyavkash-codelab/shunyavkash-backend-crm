import express from "express";
import {
  checkIn,
  checkOut,
  markLeave,
  getAllAttendance,
  getAttendanceByEmployee,
  deleteAttendance,
} from "../../attendance/controller/attendanceController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);

// Mark Leave (Admin only)
router.post("/mark-leave", protect, authorizeRoles("admin"), markLeave);

//  Get All Attendance Records (Admin only)
router.get("/", protect, getAllAttendance);

// Get Attendance by Employee (Admin or Employee viewing their own)
router.get("/:employeeId", protect, getAttendanceByEmployee);

// Delete Attendance Record (Admin only)
router.delete("/:id", protect, deleteAttendance);

export default router;
