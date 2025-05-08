import mongoose from 'mongoose';
import Invoice from '../Invoice.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import {
  safeDeleteFile,
  uploadToCloudinary
} from '../../employee/helpers/cloudinary.js';
import logger from '../../../utils/logger.util.js';
import { generateInvoiceHTML } from '../../../services/template/invoiceTemplate.service.js';
import { generatePDFFileObject } from '../../../utils/pdfGenerator.util.js';

export const regenerateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid Invoice ID');
    }

    const invoice = await Invoice.findById(id)
      .populate('client')
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

    if (invoice.cloudinaryPublicId) {
      await safeDeleteFile(invoice.cloudinaryPublicId, 'raw');
      invoice.pdfUrl = null;
      invoice.cloudinaryPublicId = null;
      invoice.pdfExists = false;
    }

    const html = generateInvoiceHTML(
      invoice,
      invoice.client,
      invoice.timesheets
    );
    const fileObject = await generatePDFFileObject(html);

    const { url, public_id } = await uploadToCloudinary(
      fileObject,
      'invoices',
      {
        resource_type: 'raw',
        format: 'pdf',
        type: 'upload',
        tags: ['invoice'],
        context: { alt: `Invoice PDF ${invoice._id}` },
        invalidate: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    );

    invoice.pdfUrl = url;
    invoice.cloudinaryPublicId = public_id;
    invoice.pdfExists = true;
    await invoice.save();

    return SendResponse(
      res,
      200,
      true,
      'Invoice PDF regenerated successfully',
      invoice
    );
  } catch (error) {
    logger.error('PDF regeneration error:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to regenerate invoice',
      error.message
    );
  }
};
