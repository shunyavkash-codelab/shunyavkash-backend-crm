import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leaveController.js";

import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("Employee", "Admin", "HR"),
  applyLeave
);
router.get(
  "/",
  protect,
  authorizeRoles("Employee", "Admin", "HR"),
  getMyLeaves
);
router.get("/all", protect, authorizeRoles("Admin", "HR"), getAllLeaves);
router.put(
  "/status/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  updateLeaveStatus
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Employee", "Admin", "HR"),
  deleteLeave
);

export default router;
