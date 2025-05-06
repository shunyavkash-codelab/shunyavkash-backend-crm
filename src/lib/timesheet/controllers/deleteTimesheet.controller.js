import mongoose from 'mongoose';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Timesheet from '../Timesheet.js';
import Invoice from '../../invoice/Invoice.js';

export const deleteTimesheet = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Timesheet ID is required');
    }

    const linkedInvoice = await Invoice.findOne({
      timesheets: id,
      status: 'Finalized'
    });

    if (linkedInvoice) {
      return SendResponse(
        res,
        400,
        false,
        'Cannot delete timesheet. It is linked to a finalized invoice.'
      );
    }

    const timesheet = await Timesheet.findByIdAndDelete(id);

    if (!timesheet) {
      return SendResponse(res, 404, false, 'Timesheet not found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Timesheet deleted successfully',
      timesheet
    );
  } catch (error) {
    logger.error('Error deleting timesheet:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to delete timesheet',
      error.message || error
    );
  }
};
