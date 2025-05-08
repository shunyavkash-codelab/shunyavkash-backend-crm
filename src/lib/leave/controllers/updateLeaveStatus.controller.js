import SendResponse from '../../../utils/sendResponse.util.js';
import Leave from '../Leave.js';
import logger from '../../../utils/logger.util.js';

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return SendResponse(
        res,
        400,
        false,
        'Invalid status value. Allowed values are Pending, Approved, or Rejected.'
      );
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return SendResponse(res, 404, false, 'Leave request not found.');
    }

    leave.status = status;
    const updatedLeave = await leave.save();

    return SendResponse(
      res,
      200,
      true,
      `Leave status updated to ${status}.`,
      updatedLeave
    );
  } catch (err) {
    logger.error('Error updating leave status:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to update leave status.',
      err.message || err
    );
  }
};
