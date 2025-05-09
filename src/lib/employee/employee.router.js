import express from 'express';
import { multiUpload } from '../../utils/cloudinaryUpload.util.js';
import { getAllEmployees } from './controllers/getAllEmployees.controller.js';
import { createEmployee } from './controllers/createEmployee.controller.js';
import { findEmployeeById } from './controllers/findEmployeeById.controller.js';
import { updateEmployee } from './controllers/updateEmployee.controller.js';
import { deleteEmployee } from './controllers/deleteEmployee.controller.js';

const employeeRoute = express.Router();

employeeRoute.post('/', multiUpload, createEmployee);
employeeRoute.get('/', getAllEmployees);
employeeRoute.get('/:id', findEmployeeById);
employeeRoute.patch('/:id', multiUpload, updateEmployee);
employeeRoute.delete('/:id', deleteEmployee);

export { employeeRoute };
