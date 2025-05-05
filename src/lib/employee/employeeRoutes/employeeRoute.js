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
// router.use(protect);

router.post("/", multiUpload, createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", multiUpload, updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
