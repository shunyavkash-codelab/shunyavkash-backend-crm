import SendResponse from '../../../utils/sendResponse.util.js';
import Leave from '../Leave.js';
import logger from '../../../utils/logger.util.js';

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate(
      'employee',
      'firstName lastName email'
    );

    if (!leaves?.length) {
      return SendResponse(res, 404, false, 'No leave requests found.');
    }

    return SendResponse(
      res,
      200,
      true,
      'Leave requests fetched successfully.',
      leaves
    );
  } catch (err) {
    logger.error('Error fetching all leave requests:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch leave requests.',
      err.message || err
    );
  }
};
