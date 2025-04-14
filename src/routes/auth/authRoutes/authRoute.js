import express from "express";
import { getLoggedInUser, registerUser } from "../controller/authController.js";
import protect from "../../../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.get("/me", protect, getLoggedInUser);

export default router;
