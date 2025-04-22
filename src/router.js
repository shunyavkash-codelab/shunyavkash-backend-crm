import express from "express";
import authRoutes from "./lib/auth/authRoutes/indexRoute.js";
import clientRoutes from "./lib/client/clientRoutes/indexRoute.js";
import projectRoutes from "./lib/project/projectRoutes/indexRoute.js";
import timesheetRoutes from "./lib/timesheet/timesheetRoutes/timesheetRoute.js";
import invoiceRoutes from "./lib/invoice/invoiceRoutes/indexRoute.js";
import employeeRoutes from "./lib/employee/employeeRoutes/indexRoute.js";
import leaveRoutes from "./lib/leave/leaveRoutes/indexRoute.js";
import interviewRoutes from "./lib/interview/interviewRoutes/indexRoute.js";
import attendanceRoutes from "./lib/attendance/attendanceRoutes/indexRoute.js";
import payrollRoutes from "./lib/payroll/payrollRoutes/indexRoute.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/client", clientRoutes);
router.use("/project", projectRoutes);
router.use("/timesheet", timesheetRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/employee", employeeRoutes);
router.use("/leave", leaveRoutes);
router.use("/interview", interviewRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/payroll", payrollRoutes);

export default router;
