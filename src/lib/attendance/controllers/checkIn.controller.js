import Attendance from '../Attendance.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (existing) {
      return SendResponse(res, 400, false, 'Already checked in for today');
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: new Date(),
      status: 'Present'
    });

    return SendResponse(res, 201, true, 'Checked in successfully', attendance);
  } catch (error) {
    logger.error('Error in checkIn:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Failed to check in',
      error.message || error
    );
  }
};
