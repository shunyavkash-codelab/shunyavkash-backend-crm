import Timesheet from '../../timesheet/Timesheet.js';
import Invoice from '../../invoice/Invoice.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import { uploadToCloudinary } from '../../employee/helpers/cloudinary.js';
import Client from '../../client/Client.js';
import { generatePDFFileObject } from '../../../utils/pdfGenerator.util.js';
import { generateInvoiceHTML } from '../../../services/template/invoiceTemplate.service.js';

export const createInvoice = async (req, res) => {
  try {
    const { clientId, timesheetIds, ratePerHour, dueDate } = req.body;

    if (!clientId || !timesheetIds?.length || !ratePerHour) {
      return SendResponse(
        res,
        400,
        false,
        'Missing required fields: clientId, timesheetIds, or ratePerHour'
      );
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return SendResponse(res, 404, false, 'Client not found');
    }

    const timesheets = await Timesheet.find({
      _id: { $in: timesheetIds },
      isFinalized: true
    }).populate({ path: 'project', select: 'title' });

    if (timesheets.length === 0) {
      return SendResponse(res, 400, false, 'No finalized timesheets found');
    }

    const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
    const totalAmount = totalHours * ratePerHour;

    const invoice = await Invoice.create({
      client: clientId,
      timesheets: timesheetIds,
      totalHours,
      ratePerHour,
      totalAmount,
      dueDate
    });

    const html = generateInvoiceHTML(invoice, client, timesheets);
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
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    );

    invoice.pdfUrl = url;
    invoice.cloudinaryPublicId = public_id;
    invoice.pdfExists = true;
    await invoice.save();

    return SendResponse(
      res,
      201,
      true,
      'Invoice created successfully',
      invoice
    );
  } catch (error) {
    logger.error('Error creating invoice:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to create invoice',
      error.message
    );
  }
};
