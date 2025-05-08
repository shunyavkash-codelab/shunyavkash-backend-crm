import Attendance from '../Attendance.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const findAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return SendResponse(res, 400, false, `Employee ID is required`);
    }
    const records = await Attendance.find({ employee: employeeId }).sort({
      date: -1
    });

    if (!records.length) {
      return SendResponse(
        res,
        404,
        false,
        'No attendance records found for this employee'
      );
    }

    return SendResponse(
      res,
      200,
      true,
      'Attendance records retrieved successfully',
      records
    );
  } catch (error) {
    logger.error('Error in getAttendanceByEmployee:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch attendance records for employee',
      error.message || error
    );
  }
};
