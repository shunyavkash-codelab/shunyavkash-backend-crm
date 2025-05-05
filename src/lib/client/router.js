import express from 'express';
import { createClient } from './controllers/createClient.controller.js';
import { getAllClients } from './controllers/getAllClient.controller.js';
import { updateClient } from './controllers/updateClient.controller.js';
import { findClientById } from './controllers/findClientById.controller.js';
import { deleteClient } from './controllers/deleteClient.controller.js';

const clientRoute = express.Router();

clientRoute.post('/', createClient);
clientRoute.get('/', getAllClients);
clientRoute.get('/:id', findClientById);
clientRoute.patch('/:id', updateClient);
clientRoute.delete('/:id', deleteClient);

export { clientRoute };
