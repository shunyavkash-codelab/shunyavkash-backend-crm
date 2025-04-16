import express from "express";
import attendanceRoutes from "../attendanceRoutes/attendanceRoute.js";

const router = express.Router();
router.use("/", attendanceRoutes);

export default router;
