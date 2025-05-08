import Payroll from '../Payroll.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const findPayrollByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return SendResponse(res, 400, false, 'Employee ID is required');
    }

    const payrolls = await Payroll.find({ employee: employeeId });

    if (!payrolls.length) {
      return SendResponse(
        res,
        404,
        false,
        'No payroll records found for this employee'
      );
    }

    return SendResponse(
      res,
      200,
      true,
      'Payroll records fetched successfully',
      payrolls
    );
  } catch (error) {
    logger.error('Error fetching payroll for employee:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Error fetching payroll for employee',
      error.message || error
    );
  }
};
