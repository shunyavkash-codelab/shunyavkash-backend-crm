import Payroll from '../Payroll.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';

export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate(
      'employee',
      'firstName lastName email'
    );

    if (!payrolls.length) {
      return SendResponse(res, 404, false, 'No payroll records found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Payroll records fetched successfully',
      payrolls
    );
  } catch (error) {
    logger.error('Error fetching payrolls:', error.message);
    return SendResponse(
      res,
      500,
      false,
      'Error fetching payrolls',
      error.message || error
    );
  }
};
