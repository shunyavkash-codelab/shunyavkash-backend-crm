import Invoice from "../../../models/Invoice.js";
import Timesheet from "../../../models/Timesheet.js";
import Client from "../../../models/Client.js";

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { clientId, timesheetIds, ratePerHour, dueDate } = req.body;

    if (!clientId || !timesheetIds || !ratePerHour) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const timesheets = await Timesheet.find({
      _id: { $in: timesheetIds },
      isFinalized: true,
    });

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

    res.status(201).json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
};

// Get All Invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("client", "name email")
      .populate("timesheets");

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
      .populate("timesheets");

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
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
};
