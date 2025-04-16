import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoiceStatus,
} from "../../invoice/controller/invoiceController.js";
import protect from "../../../middlewares/authMiddleware.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", protect, authorizeRoles("Admin"), createInvoice);
router.get("/", protect, authorizeRoles("Admin"), getInvoices);
router.get("/:id", protect, authorizeRoles("Admin"), getInvoiceById);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("Admin"),
  updateInvoiceStatus
);
router.delete("./:id", protect, authorizeRoles("Admin"), deleteInvoice);

export default router;
