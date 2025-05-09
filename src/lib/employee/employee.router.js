import express from 'express';
import { multiUpload } from '../../utils/cloudinaryUpload.util.js';
import { getAllEmployees } from './controllers/getAllEmployees.controller.js';
import { createEmployee } from './controllers/createEmployee.controller.js';
import { findEmployeeById } from './controllers/findEmployeeById.controller.js';
import { updateEmployee } from './controllers/updateEmployee.controller.js';
import { deleteEmployee } from './controllers/deleteEmployee.controller.js';
import { createEmployeeSchema } from './validations/createEmployee.js';
import { updateEmployeeSchema } from './validations/updateEmployee.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';

const employeeRoute = express.Router();

employeeRoute.post(
  '/',
  validationErrorHandler(createEmployeeSchema),
  multiUpload,
  createEmployee
);
employeeRoute.get('/', getAllEmployees);
employeeRoute.get('/:id', findEmployeeById);
employeeRoute.patch(
  '/:id',
  validationErrorHandler(updateEmployeeSchema),
  multiUpload,
  updateEmployee
);
employeeRoute.delete('/:id', deleteEmployee);

export { employeeRoute };
