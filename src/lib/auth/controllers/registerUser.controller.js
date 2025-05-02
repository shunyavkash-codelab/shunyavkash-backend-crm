import crypto from 'crypto';
import User from '../User.js';
import { hashPassword, comparePassword } from '../../../utils/bcrypt.util.js';
import { generateToken } from '../../../utils/jwt.util.js';
import { sendEmail } from '../../../services/sendEmail.service.js';
import { FRONTEND_URL } from '../../../configs/environmentConfig.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return SendResponse(res, 400, false, `All fields are required`);
    }

    let user = await User.findOne({ email });

    // LOGIN: If user already exists
    if (user) {
      const isPasswordMatch = await comparePassword(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Password not matched' });
      }
      delete user.password;

      return SendResponse(
        res,
        200,
        true,
        `User already exists. Logged in successfully`,
        {
          token: generateToken(user._id),
          user
        }
      );
    }

    // REGISTER: Create new user with default role
    const hashedPassword = await hashPassword(password);
    user = await User.create({
      email,
      password: hashedPassword,
      role: 'Employee' // Default role for all new users
    });
    delete user.password;
    return SendResponse(res, 201, true, `Registration successful`, {
      token: generateToken(user._id),
      user
    });
  } catch (error) {
    logger.error('Error in registerUser:', error.message);
    return SendResponse(
      res,
      500,
      false,
      `Error in registerUser:`,
      error.message
    );
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `You requested a password reset. Please click on below link: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    });

    res.status(200).json({ message: 'Reset link sent to email.' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res
      .status(500)
      .json({ message: 'Failed to send email', error: err.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user)
    return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};
