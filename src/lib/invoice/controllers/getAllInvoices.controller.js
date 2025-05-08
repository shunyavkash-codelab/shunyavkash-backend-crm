import { ApiFeatures } from '../../../utils/apifeature.util.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import { checkFileExists } from '../helpers/checkFileExists.js';
import Invoice from '../Invoice.js';

export const getAllInvoices = async (req, res) => {
  try {
    const apiFeature = new ApiFeatures(
      Invoice.find()
        .populate('client', 'name email')
        .populate({
          path: 'timesheets',
          populate: { path: 'project', select: 'title' }
        }),
      req.query
    )
      .search(['client.name'])
      .filter()
      .sort();

    let invoices = await apiFeature.query;
    const filterInvoicesCount = invoices.length;

    apiFeature.pagination();
    invoices = await apiFeature.query.clone();

    const invoicesWithPdfStatus = await Promise.all(
      invoices.map(async invoice => {
        if (invoice.cloudinaryPublicId) {
          try {
            const exists = await checkFileExists(invoice.cloudinaryPublicId);
            invoice.pdfExists = exists;
            if (!exists) {
              invoice.pdfUrl = null;
              invoice.cloudinaryPublicId = null;
              await invoice.save();
            }
          } catch (error) {
            logger.error('Error checking PDF existence:', error);
            invoice.pdfExists = false;
            await invoice.save();
          }
        } else {
          invoice.pdfExists = false;
        }
        return invoice;
      })
    );

    const invoicesCount = await Invoice.countDocuments();
    const totalPage = Math.ceil(
      filterInvoicesCount / (Number(req.query.limit) || 50)
    );
    const currentPage = Number(req.query.page) || 1;

    return SendResponse(res, 200, true, 'Get all client successfully', {
      invoices: invoicesWithPdfStatus,
      totalCount: invoicesCount,
      currentPage,
      filterInvoicesCount,
      totalPage
    });
  } catch (error) {
    logger.error('[Failed to fetch invoices]:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch invoices',
      error.message || error
    );
  }
};
