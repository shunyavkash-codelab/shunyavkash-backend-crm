import Invoice from '../Invoice.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import mongoose from 'mongoose';
import { safeDeleteFile } from '../../employee/helpers/cloudinary.js';

export const deleteInvoice = async (req, res) => {
  try {
    let id = req.params.id;

    if (!is || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Invoice ID is required`);
    }
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return SendResponse(res, 404, false, 'Invoice not found');
    }

    if (invoice.cloudinaryPublicId) {
      try {
        await safeDeleteFile(invoice.cloudinaryPublicId, 'raw');
        invoice.pdfUrl = null;
        invoice.cloudinaryPublicId = null;
        invoice.pdfExists = false;
      } catch (deleteErr) {
        logger.error('Failed to delete file from Cloudinary:', deleteErr);
        return SendResponse(
          res,
          500,
          false,
          'Cloudinary file deletion failed',
          deleteErr.message
        );
      }
    }

    await Invoice.findByIdAndDelete(req.params.id);

    return SendResponse(res, 200, true, 'Invoice deleted successfully');
  } catch (error) {
    logger.error('Invoice deletion error:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to delete invoice',
      error.message || error
    );
  }
};
