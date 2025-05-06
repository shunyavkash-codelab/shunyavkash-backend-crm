import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leaveController.js";

import authenticate from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("Employee", "Admin", "HR"),
  applyLeave
);
router.get(
  "/",
  authenticate,
  authorizeRoles("Employee", "Admin", "HR"),
  getMyLeaves
);
router.get("/all", authenticate, authorizeRoles("Admin", "HR"), getAllLeaves);
router.put(
  "/status/:id",
  authenticate,
  authorizeRoles("Admin", "HR"),
  updateLeaveStatus
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Employee", "Admin", "HR"),
  deleteLeave
);

export default router;
