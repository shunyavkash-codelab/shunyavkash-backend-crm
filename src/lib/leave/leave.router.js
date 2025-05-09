import express from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import authorizeRoles from '../../middlewares/role.middleware.js';
import { createLeave } from './controllers/createLeave.controller.js';
import { findLeaveByEmployeeId } from './controllers/findLeaveByEmployeeId.controller.js';
import { getAllLeaves } from './controllers/getAllLeaves.controller.js';
import { updateLeaveStatus } from './controllers/updateLeaveStatus.controller.js';
import { deleteLeave } from './controllers/deleteLeave.controller.js';
import { updateLeaveSchema } from './validations/updateLeave.js';
import { createLeaveSchema } from './validations/createLeave.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';

const leaveRoute = express.Router();

leaveRoute.post(
  '/',
  auth,
  validationErrorHandler(createLeaveSchema),
  authorizeRoles('Employee', 'Admin', 'HR'),
  createLeave
);
leaveRoute.get(
  '/',
  auth,
  authorizeRoles('Employee', 'Admin', 'HR'),
  findLeaveByEmployeeId
);
leaveRoute.get('/all', auth, authorizeRoles('Admin', 'HR'), getAllLeaves);
leaveRoute.put(
  '/status/:id',
  auth,
  validationErrorHandler(updateLeaveSchema),
  authorizeRoles('Admin', 'HR'),
  updateLeaveStatus
);
leaveRoute.delete(
  '/:id',
  auth,
  authorizeRoles('Employee', 'Admin', 'HR'),
  deleteLeave
);

export { leaveRoute };
