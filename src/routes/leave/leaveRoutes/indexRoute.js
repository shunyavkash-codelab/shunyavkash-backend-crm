import express from "express";
import leaveRoute from "./leaveRoute.js";

const router = express.Router();

router.use("/", leaveRoute);

export default router;
