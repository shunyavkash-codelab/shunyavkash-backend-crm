import express from "express";
import timesheetRoutes from "./timesheetRoute.js";

const router = express.Router();

router.use("/", timesheetRoutes);

export default router;
