import Invoice from '../Invoice.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

export const findInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('client', 'name email')
      .populate({
        path: 'timesheets',
        populate: [
          { path: 'project', select: 'title' },
          { path: 'employee', select: 'firstName lastName' }
        ]
      });

    if (!invoice) {
      return SendResponse(res, 404, false, 'Invoice not found');
    }

    try {
      if (invoice.cloudinaryPublicId) {
        const exists = await checkFileExists(invoice.cloudinaryPublicId);
        invoice.pdfExists = exists;

        if (!exists) {
          invoice.pdfUrl = null;
          invoice.cloudinaryPublicId = null;
          await invoice.save();
        }
      } else {
        invoice.pdfExists = false;
        await invoice.save();
      }
    } catch (err) {
      logger.error('Error checking PDF existence:', err);
      invoice.pdfExists = false;
      await invoice.save();
    }

    return SendResponse(
      res,
      200,
      true,
      'Invoice fetched successfully',
      invoice
    );
  } catch (error) {
    logger.error('[Failed to fetch invoice]:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch invoice',
      error.message || error
    );
  }
};
