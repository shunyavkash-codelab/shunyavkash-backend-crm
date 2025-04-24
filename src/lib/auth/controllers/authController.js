import User from "../User.js";
import { hashPassword, comparePassword } from "../../../utils/bcryptUtils.js";
import generateToken from "../../../utils/generateToken.js";

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
      message: "Something went wrong",
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
