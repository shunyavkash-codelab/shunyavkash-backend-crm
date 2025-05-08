import express from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { registerUser } from './controllers/registerUser.controller.js';
import { findLoggedInUser } from './controllers/findLoggedInUser.controller.js';
import { forgotPassword } from './controllers/forgotPassword.controller.js';
import { resetPassword } from './controllers/resetPassword.controller.js';

const authRoute = express.Router();
// remove route end point register
authRoute.post('/register', registerUser);
authRoute.get('/me', auth, findLoggedInUser);

// Forgot + Reset Password
authRoute.post('/forgot-password', forgotPassword);
authRoute.put('/reset-password/:token', resetPassword);

export { authRoute };
