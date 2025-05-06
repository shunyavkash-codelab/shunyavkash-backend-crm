import Project from '../Project.js';
import Employee from '../../employee/Employee.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import { sendEmail } from '../../../services/sendEmail.service.js';
import { generateAssignmentEmail } from '../../../services/template/emailTemplates.service.js';

export const assignEmployeesToProject = async (req, res) => {
  const { employees } = req.body;

  if (!employees || !Array.isArray(employees) || !employees.length) {
    return SendResponse(res, 400, false, 'No employees provided');
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return SendResponse(res, 404, false, 'Project not found');
    }

    const existingEmployeeIds = project.assignedEmployees.map(e =>
      e.employee.toString()
    );

    const assigned = [];
    const skippedEmployees = [];

    for (const { employeeId, role } of employees) {
      if (!employeeId || !role) {
        logger.warn(
          `[assignEmployeesToProject] Missing employeeId or role for entry: ${JSON.stringify({ employeeId, role })}`
        );
        continue;
      }

      if (existingEmployeeIds.includes(employeeId)) {
        logger.info(
          `[assignEmployeesToProject] Employee ${employeeId} already assigned. Skipping.`
        );
        skippedEmployees.push(employeeId);
        continue;
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        logger.warn(
          `[assignEmployeesToProject] Employee with ID ${employeeId} not found. Skipping.`
        );
        skippedEmployees.push(employeeId);
        continue;
      }

      // Send email notification
      if (employee.email) {
        const html = generateAssignmentEmail(
          employee.firstName,
          project.title,
          role
        );

        try {
          await sendEmail({
            to: employee.email,
            subject: 'You have been assigned to a new project',
            html
          });
        } catch (emailErr) {
          logger.error(
            `[assignEmployeesToProject] Failed to send email to ${employee.email}:`,
            emailErr
          );
        }
      }

      assigned.push({ employee: employee._id, role });
    }

    if (assigned.length > 0) {
      project.assignedEmployees.push(...assigned);
      await project.save();
    }

    const updatedProject = await Project.findById(project._id)
      .populate('client')
      .populate({
        path: 'assignedEmployees.employee',
        select: 'firstName lastName department designation avatar status'
      });

    return SendResponse(res, 200, true, 'Employees assigned successfully', {
      project: updatedProject,
      skippedEmployees
    });
  } catch (error) {
    logger.error('[assignEmployeesToProject] Error:', error);
    return SendResponse(
      res,
      500,
      false,
      'An error occurred while assigning employees to the project',
      error.message || error
    );
  }
};
