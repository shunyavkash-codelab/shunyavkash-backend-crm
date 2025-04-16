import express from "express";
import {
  createTimesheet,
  getAllTimesheets,
  getTimesheetById,
  updateTimesheet,
  deleteTimesheet,
  finalizeTimesheet,
} from "../../timesheet/controller/timesheetController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createTimesheet);
router.get("/", protect, getAllTimesheets);
router.get("/:id", getTimesheetById);
router.put("/:id", protect, updateTimesheet);
router.delete("/:id", protect, deleteTimesheet);
router.put(
  "/:id/finalize",
  protect,
  authorizeRoles("Admin"),
  finalizeTimesheet
);

export default router;
