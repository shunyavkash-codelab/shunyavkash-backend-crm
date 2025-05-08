import Attendance from '../Attendance.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const markLeave = async (req, res) => {
  try {
    const { employeeId, date, note } = req.body;
    const formattedDate = new Date(date).setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      employee: employeeId,
      date: formattedDate
    });

    if (alreadyMarked) {
      return SendResponse(
        res,
        400,
        false,
        'Attendance already exists for this date'
      );
    }

    const leave = await Attendance.create({
      employee: employeeId,
      date: formattedDate,
      status: 'Leave',
      note
    });

    return SendResponse(res, 201, true, 'Leave marked successfully', leave);
  } catch (error) {
    logger.error('Error in markLeave:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Failed to mark leave',
      error.message || error
    );
  }
};
