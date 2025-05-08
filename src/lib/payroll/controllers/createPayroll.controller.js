import Payroll from '../Payroll.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const createPayroll = async (req, res) => {
  try {
    const { employeeId, salary, month } = req.body;

    if (!employeeId || !salary || !month) {
      return SendResponse(res, 400, false, 'Missing required fields');
    }
    const payrollData = await generatePayrollData(req.body);

    const payroll = await Payroll.create(payrollData);

    return SendResponse(
      res,
      201,
      true,
      'Payroll generated successfully',
      payroll
    );
  } catch (error) {
    logger.error('Error generating payroll:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Error generating payroll',
      error.message || error
    );
  }
};
