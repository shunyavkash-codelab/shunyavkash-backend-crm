import express from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { registerUser } from './controllers/registerUser.controller.js';
import { findLoggedInUser } from './controllers/findLoggedInUser.controller.js';
import { forgotPassword } from './controllers/forgotPassword.controller.js';
import { resetPassword } from './controllers/resetPassword.controller.js';

const router = express.Router();
// remove route end point register
router.post('/register', registerUser);
router.get('/me', auth, findLoggedInUser);

// Forgot + Reset Password
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
