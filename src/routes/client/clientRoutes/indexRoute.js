// modules/indexRoute.js
import express from "express";
import clientRoute from "./clientRoute.js";

const router = express.Router();

router.use("/", clientRoute);

export default router;
