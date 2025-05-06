import Project from '../Project.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const removeEmployeeFromProject = async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
    return SendResponse(res, 400, false, 'Employee ID is required');
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return SendResponse(res, 404, false, 'Project not found');
    }

    const originalLength = project.assignedEmployees.length;

    project.assignedEmployees = project.assignedEmployees.filter(
      assigned => assigned.employee.toString() !== employeeId
    );

    if (project.assignedEmployees.length === originalLength) {
      return SendResponse(
        res,
        404,
        false,
        'Employee was not assigned to this project'
      );
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('client')
      .populate({
        path: 'assignedEmployees.employee',
        select: 'firstName lastName department designation avatar status'
      });

    return SendResponse(
      res,
      200,
      true,
      'Employee removed from project successfully',
      updatedProject
    );
  } catch (error) {
    logger.error('[removeEmployeeFromProject] Error:', error);
    return SendResponse(
      res,
      500,
      false,
      'An error occurred while removing the employee from the project',
      error.message || error
    );
  }
};
