import Invoice from "../Invoice.js";
import Timesheet from "../../timesheet/Timesheet.js";
import Client from "../../client/Client.js";
import { generateInvoiceHTML } from "../../../utils/invoiceTemplate.js";
import { generatePDFFileObject } from "../../../utils/pdfGenerator.js";
import {
  uploadToCloudinary,
  safeDeleteFile,
} from "../../../utils/cloudinaryHelpers.js";
import cloudinary from "../../../configs/cloudinary.js";
import { sendEmail } from "../../../utils/sendEmail.js";

export const checkFileExists = async (publicId, resourceType = "raw") => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
    return !!result;
  } catch (error) {
    if (error.http_code === 404) {
      return false;
    }
    throw error;
  }
};

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
    }).populate([
      { path: "project", select: "title" },
      // { path: "employee", select: "firstName lastName email" },
    ]);

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
      status: "Unpaid",
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
    invoice.pdfExists = true;
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
      invoice.pdfUrl = null;
      invoice.cloudinaryPublicId = null;
      invoice.pdfExists = false;
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
    invoice.pdfExists = true;
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

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("client", "name email")
      .populate({
        path: "timesheets",
        populate: { path: "project", select: "title" },
      });

    // Check PDF existence for each invoice
    const invoicesWithPdfStatus = await Promise.all(
      invoices.map(async (invoice) => {
        if (invoice.cloudinaryPublicId) {
          try {
            const exists = await checkFileExists(invoice.cloudinaryPublicId);
            invoice.pdfExists = exists;
            if (!exists) {
              invoice.pdfUrl = null;
              invoice.cloudinaryPublicId = null;
              await invoice.save();
            }
          } catch (error) {
            console.error("Error checking PDF existence:", error);
            invoice.pdfExists = false;
            await invoice.save();
          }
        } else {
          invoice.pdfExists = false;
        }
        return invoice;
      })
    );

    return res.status(200).json(invoicesWithPdfStatus);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: error.message });
  }
};

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

    // Check PDF existence and update database accordingly
    if (invoice.cloudinaryPublicId) {
      try {
        const exists = await checkFileExists(invoice.cloudinaryPublicId);
        invoice.pdfExists = exists;
        if (!exists) {
          invoice.pdfUrl = null;
          invoice.cloudinaryPublicId = null;
          await invoice.save();
        }
      } catch (error) {
        console.error("Error checking PDF existence:", error);
        invoice.pdfExists = false;
        await invoice.save();
      }
    } else {
      invoice.pdfExists = false;
      await invoice.save();
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

    // First get the current invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Prevent changing status if already paid
    if (invoice.status === "Paid") {
      return res.status(400).json({
        message: "Cannot change status of a paid invoice",
      });
    }

    // Only allow specific status transitions
    const allowedStatuses = ["Draft", "Unpaid", "Paid"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update the status
    invoice.status = status;
    await invoice.save();

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
      invoice.pdfUrl = null;
      invoice.cloudinaryPublicId = null;
      invoice.pdfExists = false;
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

// export const sendInvoiceEmail = async (req, res) => {
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

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     if (!invoice.pdfUrl) {
//       return res
//         .status(400)
//         .json({ message: "No PDF available for this invoice" });
//     }

//     if (invoice.status !== "Paid") {
//       return res
//         .status(400)
//         .json({ message: "Only paid invoices can be sent" });
//     }

//     // Implement your actual email sending logic here
//     const emailSent = await sendEmailToClient({
//       to: invoice.client.billingAddress,
//       subject: `Invoice #${invoice._id}`,
//       text: `Please find your invoice attached.`,
//       attachments: [
//         {
//           filename: `invoice_${invoice._id}.pdf`,
//           path: invoice.pdfUrl,
//         },
//       ],
//     });

//     if (emailSent) {
//       return res.status(200).json({ message: "Invoice sent successfully" });
//     } else {
//       return res.status(500).json({ message: "Failed to send invoice" });
//     }
//   } catch (error) {
//     console.error("Error sending invoice email:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to send invoice", error: error.message });
//   }
// };
export const sendInvoiceEmail = async (req, res) => {
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

    if (!invoice.pdfUrl) {
      return res
        .status(400)
        .json({ message: "No PDF available for this invoice" });
    }

    if (invoice.status !== "Paid") {
      return res
        .status(400)
        .json({ message: "Only paid invoices can be sent" });
    }

    // Fixed: Use the correct function name
    const emailResult = await sendEmail({
      to: invoice.client.email, // Fixed: Using email property instead of billingAddress
      subject: `Invoice #${invoice._id}`,
      text: `Please find your invoice attached.`,
      attachments: [
        {
          filename: `invoice_${invoice._id}.pdf`,
          path: invoice.pdfUrl,
        },
      ],
    });

    if (emailResult.success) {
      return res.status(200).json({ message: "Invoice sent successfully" });
    } else {
      return res.status(500).json({
        message: "Failed to send invoice",
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return res
      .status(500)
      .json({ message: "Failed to send invoice", error: error.message });
  }
};
