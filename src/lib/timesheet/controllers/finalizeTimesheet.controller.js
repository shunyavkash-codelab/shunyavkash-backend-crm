import mongoose from 'mongoose';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Timesheet from '../Timesheet.js';

export const finalizeTimesheet = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Timesheet ID is required');
    }

    const timesheet = await Timesheet.findById(id);

    if (!timesheet) {
      return SendResponse(res, 404, false, 'Timesheet not found');
    }

    if (timesheet.isFinalized) {
      return SendResponse(res, 400, false, 'Timesheet is already finalized');
    }

    timesheet.isFinalized = true;
    await timesheet.save();

    return SendResponse(
      res,
      200,
      true,
      'Timesheet finalized successfully',
      timesheet
    );
  } catch (error) {
    logger.error('Error finalizing timesheet:', error);
    return SendResponse(
      res,
      500,
      false,
      'Error finalizing timesheet',
      error.message || error
    );
  }
};
