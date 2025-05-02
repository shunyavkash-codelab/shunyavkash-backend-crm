import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { multiUpload } from "../../../middlewares/upload.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";
import protect from "../../../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/", authorizeRoles("Admin"), multiUpload, createEmployee);
router.get("/", authorizeRoles("Admin"), getAllEmployees);
router.get("/:id", authorizeRoles("Admin"), getEmployeeById);
router.put("/:id", authorizeRoles("Admin"), multiUpload, updateEmployee);
router.delete("/:id", authorizeRoles("Admin"), deleteEmployee);

export default router;
