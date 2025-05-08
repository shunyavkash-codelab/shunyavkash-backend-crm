import Attendance from '../Attendance.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate(
      'employee',
      'firstName lastName email'
    );

    if (!records.length) {
      return SendResponse(res, 404, false, 'No attendance records found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Attendance records retrieved successfully',
      records
    );
  } catch (error) {
    logger.error('Error in getAllAttendance:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch attendance records',
      error.message || error
    );
  }
};
