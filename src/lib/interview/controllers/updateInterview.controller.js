import Interview from '../Interview.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import { deleteFileFromCloudinary } from '../../employee/helpers/cloudinary.js';
import mongoose from 'mongoose';

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Interview ID is required`);
    }
    const interview = await Interview.findById(id);

    if (!interview) {
      return SendResponse(res, 404, false, 'Interview not found.');
    }

    const newResumeFile = req.files?.resume?.[0];

    if (newResumeFile && interview.resumePublicId) {
      try {
        logger.info(
          'Deleting old resume from cloud:',
          interview.resumePublicId
        );
        await deleteFileFromCloudinary(interview.resumePublicId);
      } catch (err) {
        logger.error('Failed to delete old resume:', err);
      }
    }

    // ✏️ Update fields (fallback to existing if not provided)
    const {
      candidateName,
      candidateEmail,
      position,
      interviewDate,
      interviewTime,
      interviewer,
      status,
      mode,
      location,
      feedback
    } = req.body;

    interview.candidateName = candidateName || interview.candidateName;
    interview.candidateEmail = candidateEmail || interview.candidateEmail;
    interview.position = position || interview.position;
    interview.interviewDate = interviewDate || interview.interviewDate;
    interview.interviewTime = interviewTime || interview.interviewTime;
    interview.interviewer = interviewer || interview.interviewer;
    interview.status = status || interview.status;
    interview.mode = mode || interview.mode;
    interview.location = location || interview.location;
    interview.feedback = feedback || interview.feedback;

    if (newResumeFile) {
      interview.resume = {
        name: newResumeFile.originalname,
        url: newResumeFile.path
      };
      interview.resumePublicId =
        newResumeFile.filename || newResumeFile.public_id;
    }

    const updatedInterview = await interview.save();

    return SendResponse(
      res,
      200,
      true,
      'Interview updated successfully.',
      updatedInterview
    );
  } catch (err) {
    logger.error('Error in updateInterview:', err);
    return SendResponse(
      res,
      400,
      false,
      'Failed to update interview.',
      err.message || err
    );
  }
};
