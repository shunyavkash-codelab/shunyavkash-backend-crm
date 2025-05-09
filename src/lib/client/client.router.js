import express from 'express';
import { createClient } from './controllers/createClient.controller.js';
import { getAllClients } from './controllers/getAllClient.controller.js';
import { updateClient } from './controllers/updateClient.controller.js';
import { findClientById } from './controllers/findClientById.controller.js';
import { deleteClient } from './controllers/deleteClient.controller.js';
import { createClientSchema } from './validations/createClient.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';
import { updateClientSchema } from './validations/updateClient.js';

const clientRoute = express.Router();

clientRoute.post('/', validationErrorHandler(createClientSchema), createClient);
clientRoute.get('/', getAllClients);
clientRoute.get('/:id', findClientById);
clientRoute.patch(
  '/:id',
  validationErrorHandler(updateClientSchema),
  updateClient
);
clientRoute.delete('/:id', deleteClient);

export { clientRoute };
