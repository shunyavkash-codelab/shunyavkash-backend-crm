// modules/indexRoute.js
import express from "express";
import interviewRoute from "./interviewRoute.js";

const router = express.Router();

router.use("/", interviewRoute);

export default router;
