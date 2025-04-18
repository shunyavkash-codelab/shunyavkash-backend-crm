import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoiceStatus,
  regenerateInvoicePDF,
} from "../../invoice/controller/invoiceController.js";
// import protect from "../../../middlewares/authMiddleware.js";
// import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put(
  "/:id/status",

  updateInvoiceStatus
);
router.delete("/:id", deleteInvoice);

// Regenerate PDF on demand
router.post(
  "/:id/regenerate",

  regenerateInvoicePDF
);

export default router;
