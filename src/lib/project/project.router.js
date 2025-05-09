import express from 'express';
import { getAllProjects } from './controllers/getAllProject.controller.js';
import { getArchivedProjects } from './controllers/findArchivedProjects.controller.js';
import { findProjectById } from './controllers/findProjectById.controller.js';
import { updateProject } from './controllers/updatedProject.controller.js';
import { deleteProject } from './controllers/deleteProject.controller.js';
import { removeEmployeeFromProject } from './controllers/removeEmployeeFromProject.controller.js';
import { assignEmployeesToProject } from './controllers/assignEmployeesToProject.controller.js';
import { createProject } from './controllers/createProject.controller.js';
import { createProjectSchema } from './validations/createProject.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';
import { updateProjectSchema } from './validations/updateProject.js';

const projectRoute = express.Router();

projectRoute.post(
  '/',
  validationErrorHandler(createProjectSchema),
  createProject
);
projectRoute.get('/', getAllProjects);
projectRoute.get('/archived', getArchivedProjects);
projectRoute.get('/:id', findProjectById);
projectRoute.put(
  '/:id',
  validationErrorHandler(updateProjectSchema),
  updateProject
);
projectRoute.delete('/:id', deleteProject);
projectRoute.patch('/:id/archive', getArchivedProjects);
projectRoute.put('/:id/assign', assignEmployeesToProject);
projectRoute.put('/:id/remove-employee', removeEmployeeFromProject);

export { projectRoute };
