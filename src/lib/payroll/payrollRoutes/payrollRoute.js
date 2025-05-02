import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getPayrollByEmployee,
  markAsPaid,
} from "../controllers/payrollController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect);

// Admin Only: Generate Payroll
router.post("/generate", authorizeRoles("Admin"), generatePayroll);

// Admin Only: Get All Payrolls
router.get("/", authorizeRoles("Admin"), getAllPayrolls);

// Admin or Employee: Get Payrolls of specific employee
router.get("/:employeeId", authorizeRoles("Admin"), getPayrollByEmployee);

// Admin Only: Mark Payroll as Paid
router.patch("/:id/mark-paid", authorizeRoles("Admin"), markAsPaid);

export default router;
