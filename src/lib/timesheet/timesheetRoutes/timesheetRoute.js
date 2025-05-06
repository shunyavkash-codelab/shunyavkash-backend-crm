import express from "express";
import {
  createTimesheet,
  getAllTimesheets,
  getTimesheetById,
  updateTimesheet,
  deleteTimesheet,
  finalizeTimesheet,
  getAvailableTimesheets,
} from "../controllers/timesheetController.js";
import authenticate from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorizeRoles("Admin"), createTimesheet);
router.get("/", authorizeRoles("Admin", "Employee"), getAllTimesheets);
router.get("/:id", authorizeRoles("Admin", "Employee"), getTimesheetById);
router.put("/:id", authorizeRoles("Admin", "Employee"), updateTimesheet);
router.delete("/:id", authorizeRoles("Admin"), deleteTimesheet);
router.put("/:id/finalize", authorizeRoles("Admin"), finalizeTimesheet);
router.get("/available-timesheets/:projectId", getAvailableTimesheets);

export default router;
