import crypto from 'crypto';
import { hashPassword } from '../../../utils/bcrypt.util.js';
import User from '../User.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token && !password) {
      return SendResponse(res, 400, false, `Token and password are required`);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user)
      return SendResponse(res, 400, false, `Invalid or expired reset token`);

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return SendResponse(res, 200, true, `Password has been reset successfully`);
  } catch (error) {
    logger.error('Error in resetPassword:', error.message);
    return SendResponse(res, 500, false, `resetPassword`, error);
  }
};
