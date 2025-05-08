import SendResponse from '../../../utils/sendResponse.util.js';
import Leave from '../Leave.js';
import logger from '../../../utils/logger.util.js';

export const findLeaveByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.user?._id;

    if (!employeeId) {
      return SendResponse(
        res,
        400,
        false,
        'Unauthorized: Invalid authentication credentials.'
      );
    }

    const leaves = await Leave.find({ employee: employeeId });

    if (!leaves.length) {
      return SendResponse(res, 404, false, 'No leave records found.');
    }

    return SendResponse(
      res,
      200,
      true,
      'Leave records fetched successfully.',
      leaves
    );
  } catch (error) {
    logger.error('Error fetching leave records:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch leave records.',
      error.message || error
    );
  }
};
