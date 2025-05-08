import Invoice from '../Invoice.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import mongoose from 'mongoose';

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invoice ID is required');
    }

    const allowedStatuses = ['Draft', 'Finalized', 'Paid'];

    if (!allowedStatuses.includes(status)) {
      return SendResponse(res, 400, false, 'Invalid status value');
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('client', 'name email');

    if (!invoice) {
      return SendResponse(res, 404, false, 'Invoice not found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Invoice status updated successfully',
      invoice
    );
  } catch (error) {
    logger.error('[Failed to update invoice status]:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to update invoice status',
      error.message || error
    );
  }
};
