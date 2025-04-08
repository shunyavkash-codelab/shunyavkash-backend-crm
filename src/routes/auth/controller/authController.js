import User from "../../../models/User.js";
import { hashPassword } from "../../../utils/bcryptUtils.js";
import generateToken from "../../../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Admin", "HR", "Employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    let user = await User.findOne({ email });

    // if User exists , just return token and details (like a login)
    if (user) {
      return res.status(200).json({
        message: "User already exists. Logged in successfully.",
        token: generateToken(user._id),
        user: { id: user._id, email: user.email, role: user.role },
      });
    }

    // If user doesn't exist, register new user
    const hashedPassword = await hashPassword(password);
    user = await User.create({ email, password: hashedPassword, role });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
