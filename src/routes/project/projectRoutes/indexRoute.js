// modules/indexRoute.js
import express from "express";
import projectRoute from "../../project/projectRoutes/projectRoute.js";

const router = express.Router();

router.use("/", projectRoute);

export default router;
