import User from '../lib/account/User.js';
import { JWT_SECRET } from '../configs/environmentConfig.js';
import { verifyToken } from '../utils/jwt.util.js';
import SendResponse from '../utils/sendResponse.util.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return SendResponse(
        res,
        401,
        false,
        'Authorization token missing or invalid'
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return SendResponse(res, 401, false, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return SendResponse(res, 401, false, 'Unauthorized', {
      error: error.message
    });
  }
};
