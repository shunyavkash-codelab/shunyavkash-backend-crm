import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  archiveProject,
  getArchivedProjects,
  assignEmployeesToProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/archive", archiveProject);
router.get("/archived", getArchivedProjects);
router.put("/:id/assign", assignEmployeesToProject);

export default router;
