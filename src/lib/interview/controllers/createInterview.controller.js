import Interview from '../Interview.js';
import Employee from '../../employee/Employee.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const createInterview = async (req, res) => {
  try {
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

    // Validate required fields
    if (
      !candidateName ||
      !candidateEmail ||
      !position ||
      !interviewDate ||
      !interviewTime ||
      !interviewer
    ) {
      return SendResponse(
        res,
        400,
        false,
        'Missing required interview fields.'
      );
    }

    // Check if interviewer exists
    const interviewerExists = await Employee.findById(interviewer);
    if (!interviewerExists) {
      return SendResponse(res, 404, false, 'Interviewer not found.');
    }

    // Handle resume upload
    const resumeFile = req.files?.resume?.[0];

    const newInterview = new Interview({
      candidateName,
      candidateEmail,
      position,
      interviewDate,
      interviewTime,
      interviewer,
      status,
      mode,
      location,
      feedback,
      resume: resumeFile
        ? { name: resumeFile.originalname, url: resumeFile.path }
        : undefined,
      resumePublicId: resumeFile?.filename || resumeFile?.public_id
    });

    const savedInterview = await newInterview.save();
    return SendResponse(
      res,
      201,
      true,
      'Interview created successfully.',
      savedInterview
    );
  } catch (err) {
    logger.error('Error in createInterview:', err);
    return SendResponse(
      res,
      500,
      false,
      'Failed to create interview.',
      err.message || err
    );
  }
};
