import express from "express";
import attendanceRoutes from "./attendanceRoute.js";

const router = express.Router();
router.use("/", attendanceRoutes);

export default router;
