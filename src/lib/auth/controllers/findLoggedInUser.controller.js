import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';

export const findLoggedInUser = async (req, res) => {
  try {
    if (!req.user) {
      return SendResponse(res, 401, false, 'Unauthorized: User not found');
    }

    return SendResponse(res, 200, true, 'User retrieved successfully', {
      ...req.user
    });
  } catch (error) {
    logger.error('Error in findLoggedInUser:', error.message);
    return SendResponse(res, 500, false, 'Failed to retrieve user', {
      error: error.message
    });
  }
};
