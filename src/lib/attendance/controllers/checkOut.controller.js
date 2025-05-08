import Attendance from '../Attendance.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (!attendance) {
      return SendResponse(
        res,
        404,
        false,
        'No check-in record found for today'
      );
    }

    if (attendance.checkOut) {
      return SendResponse(res, 400, false, 'Already checked out');
    }

    attendance.checkOut = new Date();
    await attendance.save();

    return SendResponse(res, 200, true, 'Checked out successfully', attendance);
  } catch (error) {
    logger.error('Error in checkOut:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Failed to check out',
      error.message || error
    );
  }
};
