import express from 'express';
import { getAllInvoices } from './controllers/getAllInvoices.controller.js';
import { createInvoice } from './controllers/createInvoice.controller.js';
import { updateInvoiceStatus } from './controllers/updateInvoiceStatus.controller.js';
import { deleteInvoice } from './controllers/deleteInvoice.controller.js';
import { findInvoiceById } from './controllers/findInvoiceById.controller.js';
import { regenerateInvoicePDF } from './controllers/regenerateInvoicePDF.controller.js';
import { updateInvoiceSchema } from './validations/updateInvoice.js';
import { createInvoiceSchema } from './validations/createInvoice.js';
import { validationErrorHandler } from '../../middlewares/validationErrorHandler.middleware.js';

const invoiceRoute = express.Router();

invoiceRoute.post(
  '/',
  validationErrorHandler(createInvoiceSchema),
  createInvoice
);
invoiceRoute.get('/', getAllInvoices);
invoiceRoute.get('/:id', findInvoiceById);
invoiceRoute.put(
  '/:id/status',
  validationErrorHandler(updateInvoiceSchema),
  updateInvoiceStatus
);
invoiceRoute.delete('/:id', deleteInvoice);
invoiceRoute.post('/:id/regenerate', regenerateInvoicePDF);

export { invoiceRoute };
