// import Invoice from "../../../models/Invoice.js";
// import Timesheet from "../../../models/Timesheet.js";
// import Client from "../../../models/Client.js";

// // Create Invoice
// export const createInvoice = async (req, res) => {
//   try {
//     const { clientId, timesheetIds, ratePerHour, dueDate } = req.body;

//     if (!clientId || !timesheetIds || !ratePerHour) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const timesheets = await Timesheet.find({
//       _id: { $in: timesheetIds },
//       isFinalized: true,
//     });

//     if (timesheets.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No valid finalized timesheets found" });
//     }

//     const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
//     const totalAmount = totalHours * ratePerHour;

//     const invoice = await Invoice.create({
//       client: clientId,
//       timesheets: timesheetIds,
//       totalHours,
//       ratePerHour,
//       totalAmount,
//       dueDate,
//     });

//     res.status(201).json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to create invoice", error: error.message });
//   }
// };

// // Get All Invoices
// export const getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find()
//       .populate("client", "name email")
//       .populate("timesheets");

//     res.json(invoices);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch invoices", error: error.message });
//   }
// };

// // Get single invoice by ID
// export const getInvoiceById = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id)
//       .populate("client", "name email")
//       .populate("timesheets");

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     res.status(200).json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch invoice", error: error.message });
//   }
// };

// // Update Invoice Status
// export const updateInvoiceStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const allowedStatuses = ["Draft", "Finalized", "Paid"];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const invoice = await Invoice.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     res.json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update invoice", error: error.message });
//   }
// };

// // Delete invoice
// export const deleteInvoice = async (req, res) => {
//   try {
//     const invoice = await Invoice.findByIdAndDelete(req.params.id);

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     res.status(200).json({ message: "Invoice deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete invoice", error: error.message });
//   }
// };
// -------------------------------------------------------------------------------------------------------

// import Invoice from "../../../models/Invoice.js";
// import Timesheet from "../../../models/Timesheet.js";
// import Client from "../../../models/Client.js";
// import { generateInvoiceHTML } from "../../../utils/invoiceTemplate.js";
// import { generatePDFFileObject } from "../../../utils/pdfGenerator.js"; // Import the new helper
// import {
//   uploadToCloudinary,
//   safeDeleteFile,
// } from "../../../utils/cloudinaryHelpers.js";

// // Create Invoice
// export const createInvoice = async (req, res) => {
//   try {
//     const { clientId, timesheetIds, ratePerHour, dueDate } = req.body;

//     if (!clientId || !timesheetIds || !ratePerHour) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const timesheets = await Timesheet.find({
//       _id: { $in: timesheetIds },
//       isFinalized: true,
//     })
//       .populate("project", "title")
//       .populate("employee", "firstName lastName");

//     if (timesheets.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No valid finalized timesheets found" });
//     }

//     const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
//     const totalAmount = totalHours * ratePerHour;

//     // Create invoice
//     const invoice = await Invoice.create({
//       client: clientId,
//       timesheets: timesheetIds,
//       totalHours,
//       ratePerHour,
//       totalAmount,
//       dueDate,
//     });

//     // Generate PDF
//     const client = await Client.findById(clientId);
//     const html = generateInvoiceHTML(invoice, client, timesheets);
//     const fileObject = await generatePDFFileObject(html); // Use the new helper

//     // Upload to Cloudinary with expiry
//     const { url, public_id } = await uploadToCloudinary(
//       fileObject,
//       "invoices",
//       {
//         type: "raw",
//         resource_type: "auto",
//         tags: ["invoice"],
//         context: { alt: "Invoice PDF" },
//         invalidate: true,
//         expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//       }
//     );

//     invoice.pdfUrl = url;
//     invoice.cloudinaryPublicId = public_id;
//     await invoice.save();

//     res.status(201).json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to create invoice", error: error.message });
//   }
// };

// // Regenerate PDF
// export const regenerateInvoicePDF = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const invoice = await Invoice.findById(id)
//       .populate("client")
//       .populate({
//         path: "timesheets",
//         populate: [
//           { path: "project", select: "title" },
//           { path: "employee", select: "firstName lastName" },
//         ],
//       });

//     if (!invoice) return res.status(404).json({ message: "Invoice not found" });

//     // Delete old Cloudinary file if exists
//     if (invoice.cloudinaryPublicId) {
//       await safeDeleteFile(invoice.cloudinaryPublicId);
//     }

//     const html = generateInvoiceHTML(
//       invoice,
//       invoice.client,
//       invoice.timesheets
//     );
//     const fileObject = await generatePDFFileObject(html); // Use the new helper

//     const { url, public_id } = await uploadToCloudinary(
//       fileObject,
//       "invoices",
//       {
//         type: "raw",
//         resource_type: "auto",
//         tags: ["invoice"],
//         context: { alt: "Invoice PDF" },
//         invalidate: true,
//         expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       }
//     );

//     invoice.pdfUrl = url;
//     invoice.cloudinaryPublicId = public_id;
//     await invoice.save();

//     res.status(200).json({ message: "Invoice PDF regenerated", invoice });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to regenerate invoice", error: error.message });
//   }
// };

// // Get All Invoices
// export const getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find()
//       .populate("client", "name email")
//       .populate("timesheets");

//     res.json(invoices);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch invoices", error: error.message });
//   }
// };

// // Get single invoice by ID
// export const getInvoiceById = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id)
//       .populate("client", "name email")
//       .populate("timesheets");

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     res.status(200).json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch invoice", error: error.message });
//   }
// };

// // Update Invoice Status
// export const updateInvoiceStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const allowedStatuses = ["Draft", "Finalized", "Paid"];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const invoice = await Invoice.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     res.json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update invoice", error: error.message });
//   }
// };

// // Delete invoice
// export const deleteInvoice = async (req, res) => {
//   try {
//     const invoice = await Invoice.findByIdAndDelete(req.params.id);

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     // Delete Cloudinary file
//     if (invoice.cloudinaryPublicId) {
//       await safeDeleteFile(invoice.cloudinaryPublicId);
//     }

//     res.status(200).json({ message: "Invoice deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete invoice", error: error.message });
//   }
// };
import Invoice from "../../../models/Invoice.js";
import Timesheet from "../../../models/Timesheet.js";
import Client from "../../../models/Client.js";
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

    // First find client to validate it exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Find and populate timesheets
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

    // Create invoice
    const invoice = await Invoice.create({
      client: clientId,
      timesheets: timesheetIds,
      totalHours,
      ratePerHour,
      totalAmount,
      dueDate,
    });

    // Generate PDF
    const html = generateInvoiceHTML(invoice, client, timesheets);
    const fileObject = await generatePDFFileObject(html);

    // Upload to Cloudinary with correct settings
    const { url, public_id } = await uploadToCloudinary(
      fileObject,
      "invoices",
      {
        resource_type: "raw", // Ensure it's treated as raw file
        format: "pdf", // Explicitly set format
        type: "upload",
        tags: ["invoice"],
        context: { alt: `Invoice PDF ${invoice._id}` },
        invalidate: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    );

    // Update invoice with PDF URL and Cloudinary ID
    invoice.pdfUrl = url;
    invoice.cloudinaryPublicId = public_id;
    await invoice.save();

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Invoice creation error:", error);
    res
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

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Delete old Cloudinary file if exists
    if (invoice.cloudinaryPublicId) {
      await safeDeleteFile(invoice.cloudinaryPublicId, "raw"); // Specify resource type
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

    res.status(200).json({ message: "Invoice PDF regenerated", invoice });
  } catch (error) {
    console.error("PDF regeneration error:", error);
    res
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

    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: error.message });
  }
};

// Get single invoice by ID
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

    res.status(200).json(invoice);
  } catch (error) {
    res
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

    res.json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update invoice", error: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Delete Cloudinary file before deleting invoice
    if (invoice.cloudinaryPublicId) {
      await safeDeleteFile(invoice.cloudinaryPublicId, "raw"); // Specify resource type
    }

    // Now delete the invoice
    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Invoice deletion error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
};
