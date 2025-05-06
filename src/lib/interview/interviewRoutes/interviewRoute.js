import express from "express";
import { interviewUpload } from "../../../middlewares/upload.js";
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";
import authenticate from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.get("/", authorizeRoles("HR", "Admin", "Employee"), getAllInterviews);
router.get("/:id", authorizeRoles("HR", "Admin", "Employee"), getInterviewById);
router.post(
  "/",
  authorizeRoles("HR", "Admin"),
  interviewUpload,
  createInterview
);
router.put(
  "/:id",
  authorizeRoles("HR", "Admin"),
  interviewUpload,
  updateInterview
);
router.delete("/:id", authorizeRoles("HR", "Admin"), deleteInterview);

export default router;
