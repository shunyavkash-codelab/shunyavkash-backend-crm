import User from '../lib/auth/User.js';
import { JWT_SECRET } from '../configs/environmentConfig.js';
import { verifyToken } from '../utils/jwt.util.js';
import SendResponse from '../utils/sendResponse.util.js';

const protect = async (req, res, next) => {
  let token;

  // Check if token is present in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];
      console.log('token', token);
      if (!token) {
        return SendResponse(res, 400, false, `Token not found!`);
      }
      // Verify token
      const decoded = verifyToken(token, JWT_SECRET);
      console.log('decoded', decoded);

      // Attach user to request
      req.user = await User.findById(decoded.id || decoded._id).select(
        '-password'
      );
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
