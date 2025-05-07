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
import authenticate from "../../../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.post("/", authorizeRoles("Admin", "HR"), multiUpload, createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", multiUpload, updateEmployee);
router.delete("/:id", authorizeRoles("Admin", "HR"), deleteEmployee);

export default router;
