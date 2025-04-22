import Invoice from "../Invoice.js";
import Timesheet from "../../timesheet/Timesheet.js";
import Client from "../../client/Client.js";
import { generateInvoiceHTML } from "../../../utils/invoiceTemplate.js";
import { generatePDFFileObject } from "../../../utils/pdfGenerator.js";
import {
  uploadToCloudinary,
  safeDeleteFile,
} from "../../../utils/cloudinaryHelpers.js";

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { clientId, timesheetIds, ratePerHour, dueDate } = req.body;

    if (!clientId || !timesheetIds || !ratePerHour) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const timesheets = await Timesheet.find({
      _id: { $in: timesheetIds },
      isFinalized: true,
    })
      .populate("project")
      .populate("employee");

    if (timesheets.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid finalized timesheets found" });
    }

    const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
    const totalAmount = totalHours * ratePerHour;

    const invoice = await Invoice.create({
      client: clientId,
      timesheets: timesheetIds,
      totalHours,
      ratePerHour,
      totalAmount,
      dueDate,
    });

    const html = generateInvoiceHTML(invoice, client, timesheets);
    const fileObject = await generatePDFFileObject(html);

    const { url, public_id } = await uploadToCloudinary(
      fileObject,
      "invoices",
      {
        resource_type: "raw",
        format: "pdf",
        type: "upload",
        tags: ["invoice"],
        context: { alt: `Invoice PDF ${invoice._id}` },
        invalidate: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    );

    invoice.pdfUrl = url;
    invoice.cloudinaryPublicId = public_id;
    await invoice.save();

    return res.status(201).json(invoice);
  } catch (error) {
    console.error("Invoice creation error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
};

// Regenerate PDF
export const regenerateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("client")
      .populate({
        path: "timesheets",
        populate: [
          { path: "project", select: "title" },
          { path: "employee", select: "firstName lastName" },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.cloudinaryPublicId) {
      await safeDeleteFile(invoice.cloudinaryPublicId, "raw");
    }

    const html = generateInvoiceHTML(
      invoice,
      invoice.client,
      invoice.timesheets
    );
    const fileObject = await generatePDFFileObject(html);

    const { url, public_id } = await uploadToCloudinary(
      fileObject,
      "invoices",
      {
        resource_type: "raw",
        format: "pdf",
        type: "upload",
        tags: ["invoice"],
        context: { alt: `Invoice PDF ${invoice._id}` },
        invalidate: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    );

    invoice.pdfUrl = url;
    invoice.cloudinaryPublicId = public_id;
    await invoice.save();

    return res
      .status(200)
      .json({ message: "Invoice PDF regenerated", invoice });
  } catch (error) {
    console.error("PDF regeneration error:", error);
    return res
      .status(500)
      .json({ message: "Failed to regenerate invoice", error: error.message });
  }
};

// Get All Invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("client", "name email")
      .populate({
        path: "timesheets",
        populate: { path: "project", select: "title" },
      });

    return res.status(200).json(invoices);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: error.message });
  }
};

// Get Single Invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("client", "name email")
      .populate({
        path: "timesheets",
        populate: [
          { path: "project", select: "title" },
          { path: "employee", select: "firstName lastName" },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch invoice", error: error.message });
  }
};

// Update Invoice Status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Draft", "Finalized", "Paid"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update invoice", error: error.message });
  }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.cloudinaryPublicId) {
      await safeDeleteFile(invoice.cloudinaryPublicId, "raw");
    }

    await Invoice.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Invoice deletion error:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
};
