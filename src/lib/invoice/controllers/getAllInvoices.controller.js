import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import { checkFileExists } from '../helpers/checkFileExists.js';
import Invoice from '../Invoice.js';

export const getAllInvoices = async (req, res) => {
  try {
    const {
      search = '',
      page = 1,
      limit = 50,
      sortkey = 'createdAt',
      sortorder = 'desc',
      filter
    } = req.query;
    let parsedFilter = {};
    if (filter) {
      try {
        parsedFilter = JSON.parse(filter);
      } catch (e) {
        logger.error('Invalid filter JSON:', e);
        return SendResponse(res, 400, false, 'Invalid filter parameter');
      }
    }
    const query = {};

    if (search) {
      query.$or = [
        { clientName: { $regex: '^' + search, $options: 'i' } },
        { status: { $regex: '^' + search, $options: 'i' } }
      ];
    }

    Object.assign(query, parsedFilter);

    const pipeline = [
      {
        $lookup: {
          from: 'clients',
          localField: 'client',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      {
        $lookup: {
          from: 'timesheets',
          localField: 'timesheets',
          foreignField: '_id',
          as: 'timesheets'
        }
      },
      {
        $unwind: {
          path: '$timesheets',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'timesheets.project',
          foreignField: '_id',
          as: 'timesheets.project'
        }
      },
      {
        $unwind: {
          path: '$timesheets.project',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          clientName: '$client.name',
          clientEmail: '$client.email',
          timesheets: 1,
          status: 1,
          pdfExists: 1,
          pdfGeneratedAt: 1,
          pdfUrl: 1,
          pdfVersion: 1,
          totalHours: 1,
          ratePerHour: 1,
          totalAmount: 1,
          dueDate: 1,
          issuedDate: 1,
          createdAt: 1,
          updatedAt: 1,
          cloudinaryPublicId: 1,
          pdfUrl: 1
        }
      },
      {
        $match: query
      },
      {
        $sort: {
          [sortkey?.trim() || 'createdAt']: sortorder === 'asc' ? 1 : -1
        }
      },
      {
        $facet: {
          paginatedResults: [
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) }
          ],
          totalCount: [{ $count: 'count' }]
        }
      }
    ];

    const result = await Invoice.aggregate(pipeline);
    const invoices = result[0].paginatedResults;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPage = Math.ceil(totalCount / limit);

    const invoicesWithPdfStatus = await Promise.all(
      invoices.map(async invoice => {
        if (invoice.cloudinaryPublicId) {
          try {
            const exists = await checkFileExists(invoice.cloudinaryPublicId);
            invoice.pdfExists = exists;
            if (!exists) {
              invoice.pdfUrl = null;
              invoice.cloudinaryPublicId = null;
              await Invoice.findByIdAndUpdate(invoice._id, {
                pdfUrl: null,
                cloudinaryPublicId: null
              });
            }
          } catch (error) {
            logger.error('Error checking PDF existence:', error);
            invoice.pdfExists = false;
          }
        } else {
          invoice.pdfExists = false;
        }
        return invoice;
      })
    );

    return SendResponse(res, 200, true, 'Get all client successfully', {
      invoices: invoicesWithPdfStatus,
      totalCount,
      currentPage: parseInt(page),
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
