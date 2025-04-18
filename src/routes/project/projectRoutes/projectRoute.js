import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  archiveProject,
  getArchivedProjects,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/archive", archiveProject);
router.get("/archived", getArchivedProjects);

export default router;
