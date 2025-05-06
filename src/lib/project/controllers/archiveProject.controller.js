import mongoose from 'mongoose';
import Project from '../Project.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const archiveProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid or missing project ID');
    }

    const project = await Project.findById(id);

    if (!project) {
      return SendResponse(res, 404, false, 'Project not found');
    }

    project.isArchived = !project.isArchived;
    await project.save();

    const message = `Project has been ${project.isArchived ? 'archived' : 'unarchived'} successfully`;

    return SendResponse(res, 200, true, message, project);
  } catch (error) {
    logger.error('[archiveProject] Error:', error);
    return SendResponse(
      res,
      500,
      false,
      'An error occurred while updating project archive status',
      error.message || error
    );
  }
};
