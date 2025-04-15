import express from "express";
import { interviewUpload } from "../../../middlewares/upload.js";
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../../interview/controller/interviewController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getAllInterviews);
router.get("/:id", getInterviewById);
router.post(
  "/",
  authorizeRoles("HR", "Admin"),
  interviewUpload,
  createInterview
);
router.put("/:id", interviewUpload, updateInterview);
router.delete("/:id", deleteInterview);

export default router;
