import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import TimeSheet from '../Timesheet.js';

export const createTimesheet = async (req, res) => {
  try {
    const { project, date, hoursWorked, description, status, user } = req.body;
    logger.log('create timesheet payload:', req.body);
    const userId = user || req.user?._id;
    if (!userId) {
      return SendResponse(res, 400, false, `User ID is required`);
    }
    const payload = new TimeSheet({
      project,
      date,
      hoursWorked,
      description,
      status,
      user: userId
    });
    await payload.save();
    const populated = await payload.populate([
      { path: 'project' },
      { path: 'user', select: 'firstName lastName email role' }
    ]);
    return SendResponse(
      res,
      200,
      true,
      `Timesheet create successfully`,
      populated
    );
  } catch (error) {
    logger.error('Error creating timeSheet:', error);
    return SendResponse(
      res,
      500,
      false,
      `Error creating timeSheet`,
      error.message || error
    );
  }
};
