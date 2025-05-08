import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Leave from '../Leave.js';

export const createLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Check for required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return SendResponse(
        res,
        400,
        false,
        'All fields (leaveType, startDate, endDate, reason) are required.'
      );
    }

    const leave = new Leave({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    const savedLeave = await leave.save();

    return SendResponse(
      res,
      201,
      true,
      'Leave request submitted successfully.',
      savedLeave
    );
  } catch (error) {
    logger.error('Error while creating leave request:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to create leave request.',
      error.message || error
    );
  }
};
