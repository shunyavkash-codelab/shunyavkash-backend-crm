// routes/timesheetRoutes.js
import express from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { createTimesheet } from './controllers/createTimeSheet.controller.js';
import { findTimesheetById } from './controllers/findTimeSheetById.controller.js';
import { updateTimesheet } from './controllers/updateTimeSheet.controller.js';
import { deleteTimesheet } from './controllers/deleteTimeSheet.controller.js';
import { finalizeTimesheet } from './controllers/finalizeTimeSheet.controller.js';
import { getAllTimesheets } from './controllers/getAllTimesheet.controller.js';
import { createTimesheetSchema } from './validations/createTimesheet.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';
import { updateTimesheetSchema } from './validations/updateTimesheet.js';

const timesheetRoute = express.Router();

timesheetRoute.use(auth);

timesheetRoute.post(
  '/',
  validationErrorHandler(createTimesheetSchema),
  createTimesheet
);
timesheetRoute.get('/', getAllTimesheets);
timesheetRoute.get('/:id', findTimesheetById);
timesheetRoute.put(
  '/:id',
  validationErrorHandler(updateTimesheetSchema),
  updateTimesheet
);
timesheetRoute.delete('/:id', deleteTimesheet);
timesheetRoute.put('/:id/finalize', finalizeTimesheet);

export { timesheetRoute };
