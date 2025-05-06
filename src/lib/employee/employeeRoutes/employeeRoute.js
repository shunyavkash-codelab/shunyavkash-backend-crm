import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { multiUpload } from '../../../utils/cloudinaryUpload.util.js';

const router = express.Router();

router.post('/', multiUpload, createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', multiUpload, updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
