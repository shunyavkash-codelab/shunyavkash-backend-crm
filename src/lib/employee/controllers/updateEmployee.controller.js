import mongoose from 'mongoose';
import Employee from '../Employee.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import {
  processUploadedFile,
  processUploadedFiles,
  safeDeleteFile
} from '../helpers/cloudinary.js';
import logger from '../../../utils/logger.util.js';

export const updateEmployee = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Employee ID is required`);
    }
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedData = { ...req.body };

    const newAvatar = req.files?.avatar?.[0];
    if (newAvatar) {
      await deleteEmployeeAvatar(employee);
      const processedAvatar = processUploadedFile(newAvatar);
      updatedData.avatar = processedAvatar.url;
      updatedData.avatarPublicId = processedAvatar.publicId;
    }

    let documentsToDelete = [];
    try {
      documentsToDelete = JSON.parse(req.body.documentsToDelete || '[]');
    } catch (e) {
      logger.warn('Invalid documentsToDelete format:', e.message);
    }

    if (documentsToDelete.length > 0) {
      for (const publicId of documentsToDelete) {
        await safeDeleteFile(publicId);
      }
      updatedData.documents = employee.documents.filter(
        doc => !documentsToDelete.includes(doc.publicId)
      );
    }

    const newDocs = req.files?.documents || [];
    if (newDocs.length > 0) {
      const processedNewDocs = processUploadedFiles(newDocs);
      updatedData.documents = [
        ...(updatedData.documents || employee.documents),
        ...processedNewDocs
      ];
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return SendResponse(
      res,
      200,
      true,
      `Updated employee successfully`,
      updatedEmployee
    );
  } catch (error) {
    logger.error(`Failed to update employee`, error);
    return SendResponse(
      res,
      500,
      false,
      `Failed to update employee`,
      error.message || error
    );
  }
};
