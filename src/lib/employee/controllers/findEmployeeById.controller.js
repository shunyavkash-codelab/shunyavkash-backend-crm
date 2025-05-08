import mongoose from 'mongoose';
import Employee from '../Employee.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Project from '../../project/Project.js';

export const findEmployeeById = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, `Employee ID is required`);
    }
    const employee = await Employee.findById(id).lean();

    if (!employee) {
      return SendResponse(res, 404, false, `Employee not found`);
    }

    const projects = await Project.find({
      assignedEmployees: employee._id
    }).select('name description status');

    return SendResponse(res, 200, true, `Employee retrieved successfully`, {
      ...employee,
      assignedProjects: projects
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch employee',
      error: err.message
    });
  }
};
