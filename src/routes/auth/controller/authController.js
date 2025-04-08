import User from "../../../models/User.js";
import { hashPassword } from "../../../utils/bcryptUtils.js";
import generateToken from "../../../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "HR", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ email, password: hashedPassword, role });

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
