import express from "express";
import {
  createTimesheet,
  getAllTimesheets,
  updateTimesheet,
  deleteTimesheet,
  finalizeTimesheet,
} from "../../timesheet/controller/timesheetController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createTimesheet);
router.get("/", getAllTimesheets);
router.put("/:id", updateTimesheet);
router.delete("/:id", deleteTimesheet);
router.put(
  "/:id/finalize",
  protect,
  authorizeRoles("Admin"),
  finalizeTimesheet
);

export default router;
