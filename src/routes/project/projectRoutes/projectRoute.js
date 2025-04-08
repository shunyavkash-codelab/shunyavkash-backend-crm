import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
