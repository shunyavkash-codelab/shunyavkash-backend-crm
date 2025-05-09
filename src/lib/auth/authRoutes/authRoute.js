import express from "express";
import {
  getLoggedInUser,
  registerUser,
  forgotPassword,
  resetPassword,
  verifyPassword,
} from "../controllers/authController.js";
import authenticate from "../../../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.get("/me", authenticate, getLoggedInUser);

// Forgot + Reset Password
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.post("/verify-password", authenticate, verifyPassword);

export default router;
