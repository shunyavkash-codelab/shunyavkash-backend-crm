// modules/indexRoute.js
import express from "express";
import invoiceRoute from "./invoiceRoute.js";

const router = express.Router();

router.use("/", invoiceRoute);

export default router;
