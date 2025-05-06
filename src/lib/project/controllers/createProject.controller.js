import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Project from '../Project.js';

export const createProject = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return SendResponse(res, 400, false, 'Request body cannot be empty');
    }

    const project = await Project.create(payload);

    return SendResponse(res, 200, true, `Project create successfully`, project);
  } catch (error) {
    logger.error('Error creating project:', error);
    return SendResponse(
      req,
      500,
      false,
      `Error creating project`,
      error.message || error
    );
  }
};
