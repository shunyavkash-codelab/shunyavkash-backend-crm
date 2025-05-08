import Interview from '../Interview.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const findInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id).populate(
      'interviewer',
      'firstName lastName email'
    );

    if (!interview) {
      return SendResponse(res, 404, false, 'Interview not found.');
    }

    return SendResponse(
      res,
      200,
      true,
      'Interview fetched successfully.',
      interview
    );
  } catch (err) {
    logger.error('Error in getInterviewById:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch interview.',
      err.message || err
    );
  }
};
