import Attendance from '../Attendance.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import mongoose from 'mongoose';

export const deleteAttendance = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Attendance ID is required`);
    }
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return SendResponse(res, 404, false, 'Attendance record not found');
    }

    if (req.user.role !== 'admin') {
      return SendResponse(
        res,
        403,
        false,
        'You are not authorized to delete this attendance'
      );
    }

    await Attendance.findByIdAndDelete(req.params.id);
    return SendResponse(res, 200, true, 'Attendance deleted successfully');
  } catch (error) {
    logger.error('Error in deleteAttendance:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Failed to delete attendance record',
      error.message || error
    );
  }
};
