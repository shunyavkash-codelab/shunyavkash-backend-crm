import Interview from '../Interview.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import mongoose from 'mongoose';
import { deleteFileFromCloudinary } from '../../employee/helpers/cloudinary.js';

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Interview ID is required`);
    }
    const interview = await Interview.findById(id);

    if (!interview) {
      return SendResponse(res, 404, false, 'Interview not found.');
    }

    if (interview.resumePublicId) {
      try {
        logger.info('Deleting resume from cloud:', interview.resumePublicId);
        await deleteFileFromCloudinary(interview.resumePublicId);
      } catch (err) {
        logger.error('Failed to delete resume:', err);
      }
    }

    await Interview.findByIdAndDelete(id);

    return SendResponse(res, 200, true, 'Interview deleted successfully.');
  } catch (err) {
    logger.error('Error in deleteInterview:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to delete interview.',
      err.message || err
    );
  }
};
