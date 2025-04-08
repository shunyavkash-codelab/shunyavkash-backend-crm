import express from "express";
import authRoutes from "./auth/authRoutes/indexRoute.js";
import clientRoutes from "./client/clientRoutes/indexRoute.js";
import projectRoutes from "./project/projectRoutes/indexRoute.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/client", clientRoutes);
router.use("/project", projectRoutes);

export default router;
