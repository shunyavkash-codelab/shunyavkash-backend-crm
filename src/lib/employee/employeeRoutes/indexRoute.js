import express from "express";
import employeeRoute from "./employeeRoute.js";

const router = express.Router();

router.use("/", employeeRoute);

export default router;
