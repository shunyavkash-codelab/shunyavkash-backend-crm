import express from "express";
import {
  getLoggedInUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import protect from "../../../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.get("/me", protect, getLoggedInUser);

// Forgot + Reset Password
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
