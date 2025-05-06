import express from 'express';
import { getAllProjects } from './controllers/getAllProject.controller.js';
import { getArchivedProjects } from './controllers/findArchivedProjects.controller.js';
import { findProjectById } from './controllers/findProjectById.controller.js';
import { updateProject } from './controllers/updatedProject.controller.js';
import { deleteProject } from './controllers/deleteProject.controller.js';
import { removeEmployeeFromProject } from './controllers/removeEmployeeFromProject.controller.js';
import { assignEmployeesToProject } from './controllers/assignEmployeesToProject.controller.js';
import { createProject } from './controllers/createProject.controller.js';

const projectRoute = express.Router();

projectRoute.post('/', createProject);
projectRoute.get('/', getAllProjects);
projectRoute.get('/archived', getArchivedProjects);
projectRoute.get('/:id', findProjectById);
projectRoute.put('/:id', updateProject);
projectRoute.delete('/:id', deleteProject);
projectRoute.patch('/:id/archive', getArchivedProjects);
projectRoute.put('/:id/assign', assignEmployeesToProject);
projectRoute.put('/:id/remove-employee', removeEmployeeFromProject);

export { projectRoute };
