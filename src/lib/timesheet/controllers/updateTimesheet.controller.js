import mongoose from 'mongoose';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Timesheet from '../Timesheet.js';

export const updateTimesheet = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid or missing timesheet ID');
    }

    const updateData = { ...req.body };

    if (updateData.description !== undefined) {
      updateData.description = Array.isArray(updateData.description)
        ? updateData.description
        : updateData.description.split(',').map(t => t.trim());
    }

    const timesheet = await Timesheet.findByIdAndUpdate(id, updateData, {
      new: true
    })
      .populate('user', 'firstName lastName email role')
      .populate({
        path: 'project',
        populate: {
          path: 'client',
          select: 'name'
        }
      });

    if (!timesheet) {
      return SendResponse(res, 404, false, 'Timesheet not found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Timesheet updated successfully',
      timesheet
    );
  } catch (error) {
    logger.error('Error while updating timesheet:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to update timesheet',
      error.message || error
    );
  }
};
