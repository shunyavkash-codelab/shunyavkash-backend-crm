import SendResponse from '../../../utils/sendResponse.util.js';
import User from '../User.js';
import { sendEmail } from '../../../services/sendEmail.service.js';
import { FRONTEND_URL } from '../../../configs/environmentConfig.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return SendResponse(res, 400, false, `Email is required`);

  const user = await User.findOne({ email });
  if (!user) return SendResponse(res, 404, false, `User not found`);

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

    return SendResponse(res, 200, true, `Reset link sent to email.`);
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return SendResponse(res, 500, false, `Failed to send email`, err.message);
  }
};
