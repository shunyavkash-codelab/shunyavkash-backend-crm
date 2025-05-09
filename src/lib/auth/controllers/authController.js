import crypto from "crypto";
import User from "../User.js";
import { hashPassword, comparePassword } from "../../../utils/bcryptUtils.js";
import generateToken from "../../../utils/generateToken.js";
import { sendEmail } from "../../../utils/sendEmail.js";

// Register or Login user
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });

    // LOGIN: If user already exists
    if (user) {
      const isPasswordMatch = await comparePassword(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Password not matched" });
      }

      return res.status(200).json({
        message: "User already exists. Logged in successfully.",
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    }

    // REGISTER: Create new user with default role
    const hashedPassword = await hashPassword(password);
    user = await User.create({
      email,
      password: hashedPassword,
      role: "Employee", // Default role for all new users
    });

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({
      message: "Error in registering new user",
      error: error.message,
    });
  }
};

// Get Logged-In User Info (via middleware auth)
export const getLoggedInUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in getLoggedInUser:", error.message);
    return res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  // const message = `You requested a password reset. Please click on below link: \n\n ${resetUrl}`;
  const message = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <style>
    body {
      background-color: #f4f6f8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px 30px;
      border-radius: 8px;
      box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    .logo {
      width: 120px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      color: #333333;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      color: #555555;
      margin-bottom: 30px;
    }
    a.button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://res.cloudinary.com/dgm6svyrc/image/upload/v1746685017/shunyavkash-logo_obijb0.png" alt="Shunyavkash" class="logo">
    <h1>Password Reset Request</h1>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p style="margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Shunyavkash PVT. LTD. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

// Verify Password (used before allowing sensitive actions like update/delete)
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Password verified successfully" });
  } catch (error) {
    console.error("Error in verifyPassword:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
