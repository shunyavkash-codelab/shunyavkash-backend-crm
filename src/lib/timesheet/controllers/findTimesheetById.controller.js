import mongoose from 'mongoose';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Timesheet from '../Timesheet.js';

export const findTimesheetById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Timesheet ID is required');
    }

    const timesheet = await Timesheet.findById(id)
      .populate('user', 'firstName lastName email role')
      .populate('project', 'title');

    if (!timesheet) {
      return SendResponse(res, 404, false, `Timesheet not found`);
    }

    return SendResponse(
      res,
      200,
      true,
      `Timesheet retrieved successfully`,
      timesheet
    );
  } catch (error) {
    logger.error('Error fetching timesheet:', error);
    return SendResponse(
      res,
      500,
      false,
      `Error fetching timesheet`,
      error.message || error
    );
  }
};
