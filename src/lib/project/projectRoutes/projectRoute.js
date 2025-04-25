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
  removeEmployeeFromProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/archived", getArchivedProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/archive", archiveProject);
router.put("/:id/assign", assignEmployeesToProject);
router.put("/:id/remove-employee", removeEmployeeFromProject);

export default router;
