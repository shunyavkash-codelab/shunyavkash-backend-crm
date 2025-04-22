// modules/indexRoute.js
import express from "express";
import projectRoute from "./projectRoute.js";

const router = express.Router();

router.use("/", projectRoute);

export default router;
