import mongoose from 'mongoose';
import logger from '../../../utils/logger.util.js';
import Project from '../Project.js';
import SendResponse from '../../../utils/sendResponse.util.js';

export const findProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid or missing project ID');
    }

    const project = await Project.findById(id).populate('client').populate({
      path: 'assignedEmployees.employee',
      select: 'firstName lastName department designation avatar status'
    });

    if (!project) {
      return SendResponse(
        res,
        404,
        false,
        'No project found with the provided ID'
      );
    }

    return SendResponse(
      res,
      200,
      true,
      'Project details fetched successfully',
      project
    );
  } catch (error) {
    logger.error('[getProjectById] Error:', error);
    return SendResponse(
      res,
      500,
      false,
      'An error occurred while retrieving the project',
      error.message || error
    );
  }
};
