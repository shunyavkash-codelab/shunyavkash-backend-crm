import express from "express";
import authRoutes from "./auth/authRoutes/indexRoute.js";
import clientRoutes from "./client/clientRoutes/indexRoute.js";
import projectRoutes from "./project/projectRoutes/indexRoute.js";
import timesheetRoutes from "./timesheet/timesheetRoutes/timesheetRoute.js";
import invoiceRoutes from "./invoice/invoiceRoutes/indexRoute.js";
import employeeRoutes from "./employee/employeeRoutes/indexRoute.js";
import leaveRoutes from "./leave/leaveRoutes/indexRoute.js";
import interviewRoutes from "./interview/interviewRoutes/indexRoute.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/client", clientRoutes);
router.use("/project", projectRoutes);
router.use("/timesheet", timesheetRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/employee", employeeRoutes);
router.use("/leave", leaveRoutes);
router.use("/interview", interviewRoutes);

export default router;
