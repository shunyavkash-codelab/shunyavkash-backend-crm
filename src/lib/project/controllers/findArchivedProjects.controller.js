import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Project from '../Project.js';

export const getArchivedProjects = async (req, res) => {
  try {
    const archivedProjects = await Project.find({ isArchived: true }).populate(
      'client',
      'name'
    );

    if (!archivedProjects || archivedProjects.length === 0) {
      return SendResponse(res, 404, false, 'No archived projects found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Archived projects retrieved successfully',
      archivedProjects
    );
  } catch (error) {
    logger.error('[getArchivedProjects] Error:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to fetch archived projects',
      error.message || error
    );
  }
};
