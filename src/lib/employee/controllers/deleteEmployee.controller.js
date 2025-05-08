import mongoose from 'mongoose';
import Employee from '../Employee.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import {
  deleteEmployeeAvatar,
  deleteEmployeeDocuments
} from '../helpers/cloudinary.js';
import logger from '../../../utils/logger.util.js';
import Project from '../../project/Project.js';

export const deleteEmployee = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Employee ID is require`);
    }
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const assignedProjects = await Project.find({
      'assignedEmployees.employee': employee._id
    });

    if (assignedProjects.length > 0) {
      return SendResponse(
        res,
        400,
        false,
        'Cannot delete employee assigned to one or more projects.',
        assignedProjects.map(p => ({
          id: p._id,
          title: p.title
        }))
      );
    }

    await deleteEmployeeAvatar(employee);
    await deleteEmployeeDocuments(employee.documents);
    await Employee.findByIdAndDelete(id);

    return SendResponse(res, 200, true, `Employee deleted successfully`);
  } catch (error) {
    logger.error(`Failed to delete employee`, error);
    return SendResponse(
      res,
      500,
      false,
      `Failed to delete employee`,
      error.message || error
    );
  }
};
