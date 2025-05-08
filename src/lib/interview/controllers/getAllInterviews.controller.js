import Interview from '../Interview.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate(
      'interviewer',
      'firstName lastName email'
    );

    if (!interviews.length) {
      return SendResponse(res, 404, false, 'No interviews found.');
    }

    return SendResponse(
      res,
      200,
      true,
      'Interviews fetched successfully.',
      interviews
    );
  } catch (err) {
    logger.error('Error in getAllInterviews:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch interviews.',
      err.message || err
    );
  }
};
