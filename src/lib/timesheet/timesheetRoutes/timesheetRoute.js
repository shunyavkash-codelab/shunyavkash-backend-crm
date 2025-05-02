import express from "express";
import {
  createTimesheet,
  getAllTimesheets,
  getTimesheetById,
  updateTimesheet,
  deleteTimesheet,
  finalizeTimesheet,
} from "../controllers/timesheetController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles("Admin"), createTimesheet);
router.get("/", authorizeRoles("Admin", "Employee"), getAllTimesheets);
router.get("/:id", authorizeRoles("Admin", "Employee"), getTimesheetById);
router.put("/:id", authorizeRoles("Admin", "Employee"), updateTimesheet);
router.delete("/:id", authorizeRoles("Admin"), deleteTimesheet);
router.put("/:id/finalize", authorizeRoles("Admin"), finalizeTimesheet);

export default router;
