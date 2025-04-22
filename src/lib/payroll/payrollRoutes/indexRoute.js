import express from "express";
import payrollRoute from "./payrollRoute.js";

const router = express.Router();

router.use("/", payrollRoute);

export default router;
