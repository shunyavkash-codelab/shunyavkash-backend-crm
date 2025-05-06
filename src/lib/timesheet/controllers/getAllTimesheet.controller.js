import { ApiFeatures } from '../../../utils/apiFeature.util.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Timesheet from '../Timesheet.js';

export const getAllTimesheets = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'Admin';
    const timeSheetQuery = isAdmin
      ? {}
      : { $or: [{ user: req.user._id }, { user: null }] };

    const searchFields = [
      'user.firstName',
      'user.role',
      'user.lastName',
      'project.title'
    ];
    const apiFeature = new ApiFeatures(
      Timesheet.find(timeSheetQuery)
        .populate('user', 'firstName lastName email role')
        .populate({
          path: 'project',
          populate: {
            path: 'client',
            select: '_id name'
          }
        }),
      req.query
    )
      .search(searchFields)
      .filter()
      .sort();

    const filteredResults = await apiFeature.query.clone();
    const filterTimeSheetCount = filteredResults.length;

    apiFeature.pagination();
    const paginatedResults = await apiFeature.query.clone();

    const totalCount = await Timesheet.countDocuments(timeSheetQuery);
    const limit = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPage = Math.ceil(filterTimeSheetCount / limit);

    return SendResponse(res, 200, true, 'Timesheets retrieved successfully', {
      timesheets: paginatedResults,
      totalCount,
      filterTimeSheetCount,
      currentPage,
      totalPage
    });
  } catch (error) {
    logger.error('Error fetching timesheets:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch timesheets',
      error.message || error
    );
  }
};
