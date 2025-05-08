import { ApiFeatures } from '../../../utils/apifeature.util.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Employee from '../Employee.js';

export const getAllEmployees = async (req, res) => {
  try {
    let searchFiled = ['firstName', ' lastName', 'status'];

    const apiFeature = new ApiFeatures(Employee.find(), req.query)
      .search(searchFiled)
      .filter()
      .sort();

    let employee = await apiFeature.query;
    const filterEmployeeCount = employee.length;
    apiFeature.pagination();
    employee = await apiFeature.query.clone();

    const employeeCount = await Employee.countDocuments();
    const totalPage = Math.ceil(
      filterEmployeeCount / (Number(req.query.limit) || 50)
    );
    const currentPage = Number(req.query.page) || 1;

    return SendResponse(res, 200, true, 'Get all employee successfully', {
      employee,
      totalCount: employeeCount,
      currentPage,
      filterEmployeeCount,
      totalPage
    });
  } catch (error) {
    logger.error(`Failed to fetch employees`, error);
    return SendResponse(
      res,
      500,
      false,
      `Failed to fetch employees`,
      error.message || error
    );
  }
};
