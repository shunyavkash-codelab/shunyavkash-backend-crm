import express from "express";
import {
  createTimesheet,
  getAllTimesheets,
  getTimesheetById,
  updateTimesheet,
  deleteTimesheet,
  finalizeTimesheet,
} from "../controllers/timesheetController.js";
// import protect from "../../../middlewares/authMiddleware.js";
// import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", createTimesheet);
router.get("/", getAllTimesheets);
router.get("/:id", getTimesheetById);
router.put("/:id", updateTimesheet);
router.delete("/:id", deleteTimesheet);
router.put(
  "/:id/finalize",

  finalizeTimesheet
);

export default router;
