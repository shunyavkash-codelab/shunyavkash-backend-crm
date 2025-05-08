import Payroll from '../Payroll.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import mongoose from 'mongoose';

export const updatedPayroll = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Payroll ID is required`);
    }
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return SendResponse(res, 404, false, 'Payroll not found');
    }

    if (payroll.status === 'Paid') {
      return SendResponse(res, 400, false, 'Payroll is already marked as paid');
    }

    payroll.status = 'Paid';
    await payroll.save();

    return SendResponse(res, 200, true, 'Payroll marked as paid', payroll);
  } catch (error) {
    logger.error('Error marking payroll as paid:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Error marking payroll as paid',
      error.message || error
    );
  }
};
