import express from 'express';

import { auth } from '../../middlewares/auth.middleware.js';
import authorizeRoles from '../../middlewares/role.middleware.js';
import { getAllInterviews } from './controllers/getAllInterviews.controller.js';
import { findInterviewById } from './controllers/findInterviewById.controller.js';
import { createInterview } from './controllers/createInterview.controller.js';
import { updateInterview } from './controllers/updateInterview.controller.js';
import { deleteInterview } from './controllers/deleteInterview.controller.js';
import { interviewUpload } from '../../utils/cloudinaryUpload.util.js';

const interviewRoute = express.Router();
interviewRoute.use(auth);

interviewRoute.get(
  '/',
  authorizeRoles('HR', 'Admin', 'Employee'),
  getAllInterviews
);
interviewRoute.get(
  '/:id',
  authorizeRoles('HR', 'Admin', 'Employee'),
  findInterviewById
);
interviewRoute.post(
  '/',
  authorizeRoles('HR', 'Admin'),
  interviewUpload,
  createInterview
);
interviewRoute.put(
  '/:id',
  authorizeRoles('HR', 'Admin'),
  interviewUpload,
  updateInterview
);
interviewRoute.delete('/:id', authorizeRoles('HR', 'Admin'), deleteInterview);

export { interviewRoute };
