// routes/timesheetRoutes.js
import express from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { createTimesheet } from './controllers/createTimeSheet.controller.js';
import { getAllTimesheets } from './controllers/getAllTimeSheet.controller.js';
import { findTimesheetById } from './controllers/findTimeSheetById.controller.js';
import { updateTimesheet } from './controllers/updateTimeSheet.controller.js';
import { deleteTimesheet } from './controllers/deleteTimeSheet.controller.js';
import { finalizeTimesheet } from './controllers/finalizeTimeSheet.controller.js';

const timesheetRoute = express.Router();

timesheetRoute.use(auth);

timesheetRoute.post('/', createTimesheet);
timesheetRoute.get('/', getAllTimesheets);
timesheetRoute.get('/:id', findTimesheetById);
timesheetRoute.put('/:id', updateTimesheet);
timesheetRoute.delete('/:id', deleteTimesheet);
timesheetRoute.put('/:id/finalize', finalizeTimesheet);

export { timesheetRoute };
