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
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/", authorizeRoles("Admin"), createProject);
router.get("/", authorizeRoles("Admin"), getAllProjects);
router.get("/archived", authorizeRoles("Admin"), getArchivedProjects);
router.get("/:id", authorizeRoles("Admin", "Employee"), getProjectById);
router.put("/:id", authorizeRoles("Admin"), updateProject);
router.delete("/:id", authorizeRoles("Admin"), deleteProject);
router.patch("/:id/archive", authorizeRoles("Admin"), archiveProject);
router.put("/:id/assign", authorizeRoles("Admin"), assignEmployeesToProject);
router.put(
  "/:id/remove-employee",
  authorizeRoles("Admin"),
  removeEmployeeFromProject
);

export default router;
