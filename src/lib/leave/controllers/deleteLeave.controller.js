import SendResponse from '../../../utils/sendResponse.util.js';
import Leave from '../Leave.js';
import logger from '../../../utils/logger.util.js';
import mongoose from 'mongoose';

export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Leave ID is required`);
    }
    const leave = await Leave.findById(id);
    if (!leave) {
      return SendResponse(res, 404, false, 'Leave request not found.');
    }

    if (req.user.role !== 'admin') {
      if (leave.employee.toString() !== req.user._id.toString()) {
        return SendResponse(
          res,
          403,
          false,
          'You are not authorized to delete this leave.'
        );
      }

      if (leave.status !== 'Pending') {
        return SendResponse(
          res,
          400,
          false,
          'Only pending leaves can be deleted.'
        );
      }
    }

    await leave.deleteOne();
    return SendResponse(res, 200, true, 'Leave deleted successfully.');
  } catch (err) {
    logger.error('Error deleting leave:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to delete leave.',
      err.message || err
    );
  }
};
