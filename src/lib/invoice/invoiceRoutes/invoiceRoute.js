import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoiceStatus,
  regenerateInvoicePDF,
  sendInvoiceEmail,
} from "../controllers/invoiceController.js";
import authenticate from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(authenticate);
// Admin only
router.post("/", authorizeRoles("Admin"), createInvoice);
router.get("/", authorizeRoles("Admin"), getInvoices);
router.get("/:id", authorizeRoles("Admin"), getInvoiceById);
router.put("/:id/status", authorizeRoles("Admin"), updateInvoiceStatus);
router.delete("/:id", authorizeRoles("Admin"), deleteInvoice);

// Regenerate PDF on demand
router.post(
  "/:id/regenerate",

  regenerateInvoicePDF
);
router.post("/:id/send", sendInvoiceEmail);

export default router;
