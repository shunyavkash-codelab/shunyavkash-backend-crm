import express from 'express';
import {
  registerUser,
  forgotPassword,
  resetPassword
} from './controllers/registerUser.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { findLoggedInUser } from './controllers/findLoggedInUser.controller.js';

const router = express.Router();
// remove route end point register
router.post('/register', registerUser);
router.get('/me', auth, findLoggedInUser);

// Forgot + Reset Password
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
