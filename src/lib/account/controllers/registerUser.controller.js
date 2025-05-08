import User from '../User.js';
import { hashPassword, comparePassword } from '../../../utils/bcrypt.util.js';
import { generateToken } from '../../../utils/jwt.util.js';
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
