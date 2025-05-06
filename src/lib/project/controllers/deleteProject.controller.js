import Project from '../Project.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import mongoose from 'mongoose';

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Project ID is required');
    }

    const project = await Project.findByIdAndDelete(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!project) {
      return SendResponse(res, 404, false, 'Project not found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Project deleted successfully',
      project
    );
  } catch (error) {
    logger.error('[deleteProject] Error deleting project:', error);
    return SendResponse(
      res,
      500,
      false,
      'An error occurred while deleting the project',
      error.message || error
    );
  }
};
