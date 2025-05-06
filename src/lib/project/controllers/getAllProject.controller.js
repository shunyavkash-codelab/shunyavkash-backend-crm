import { ApiFeatures } from '../../../utils/apiFeature.util.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Project from '../Project.js';

export const getAllProjects = async (req, res) => {
  try {
    const searchFields = ['title', 'description', 'priority', 'status'];

    const apiFeature = new ApiFeatures(Project.find({}), req.query)
      .search(searchFields)
      .filter()
      .sort();

    let projects = await apiFeature.query;
    let filterProjectCount = projects.length;
    apiFeature.pagination();
    projects = await apiFeature.query.clone();

    const totalProjectCount = await Project.countDocuments();
    const totalPage = Math.ceil(filterProjectCount / req.query.limit);
    const currentPage = Number(req.query.page) || 1;

    return SendResponse(res, 200, true, 'Get all project successfully', {
      projects,
      totalCount: totalProjectCount,
      currentPage,
      filterProjectCount,
      totalPage
    });
  } catch (error) {
    logger.error('[Get All project Error]:', error);
    return SendResponse(
      res,
      500,
      false,
      `[Get All projects Error]`,
      error.message || error
    );
  }
};
