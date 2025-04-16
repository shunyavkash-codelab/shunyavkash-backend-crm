import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getPayrollByEmployee,
  markAsPaid,
} from "../controller/payrollController.js";

// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin Only: Generate Payroll
router.post("/generate", generatePayroll);

// Admin Only: Get All Payrolls
router.get("/", getAllPayrolls);

// Admin or Employee: Get Payrolls of specific employee
router.get("/:employeeId", getPayrollByEmployee);

// Admin Only: Mark Payroll as Paid
router.patch("/:id/mark-paid", markAsPaid);

export default router;
