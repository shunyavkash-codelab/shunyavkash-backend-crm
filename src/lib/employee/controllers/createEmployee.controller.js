import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Employee from '../Employee.js';
import {
  processUploadedFile,
  processUploadedFiles
} from '../helpers/cloudinary.js';

export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      salary,
      status,
      address
    } = req.body;

    const avatarFile = processUploadedFile(req.files?.avatar?.[0]);
    const documents = processUploadedFiles(req.files?.documents);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      salary,
      status,
      address,
      avatar: avatarFile?.url || '',
      avatarPublicId: avatarFile?.publicId || '',
      documents
    });

    const savedEmployee = await newEmployee.save();
    return SendResponse(res, 200, true, `Employee create successfully `, {
      Employee: savedEmployee
    });
  } catch (error) {
    logger.error('Failed to create employee', error);
    return SendResponse(
      res,
      500,
      false,
      `Failed to create employee`,
      error.message || error
    );
  }
};
