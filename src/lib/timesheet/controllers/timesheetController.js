import Timesheet from "../Timesheet.js";
import Invoice from "../../invoice/Invoice.js";

// Create new timesheet entry
export const createTimesheet = async (req, res) => {
  const { employee, project, date, hoursWorked, description } = req.body;

  // Validate required fields
  if (!employee || !project || !date || !hoursWorked) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const timesheet = await Timesheet.create({
      employee,
      project,
      date,
      hoursWorked,
      description,
    });

    return res.status(201).json(timesheet); // Return after successful creation
  } catch (err) {
    console.error("Error creating timesheet:", err);
    return res
      .status(500)
      .json({ message: "Error creating timesheet", error: err.message });
  }
};

// Get all timesheets
export const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find()
      .populate("employee", "email role")
      .populate("project", "title");

    return res.status(200).json(timesheets); // Return the timesheets found
  } catch (err) {
    console.error("Error fetching timesheets:", err);
    return res
      .status(500)
      .json({ message: "Error fetching timesheets", error: err.message });
  }
};

// Get single timesheet by ID
export const getTimesheetById = async (req, res) => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findById(id)
      .populate("employee", "firstName lastName email role")
      .populate("project", "title");

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    return res.status(200).json(timesheet); // Return the single timesheet
  } catch (err) {
    console.error("Error fetching timesheet:", err);
    return res
      .status(500)
      .json({ message: "Error fetching timesheet", error: err.message });
  }
};

// Update timesheet by ID
export const updateTimesheet = async (req, res) => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    return res.status(200).json(timesheet); // Return the updated timesheet
  } catch (err) {
    console.error("Error updating timesheet:", err);
    return res
      .status(500)
      .json({ message: "Error updating timesheet", error: err.message });
  }
};

// Delete timesheet
export const deleteTimesheet = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if this timesheet is in any finalized invoice
    const linkedInvoice = await Invoice.findOne({
      timesheets: id,
      status: "Finalized",
    });

    if (linkedInvoice) {
      return res.status(400).json({
        message:
          "Cannot delete timesheet. It is linked to a finalized invoice.",
      });
    }

    // Proceed with deletion if safe
    const timesheet = await Timesheet.findByIdAndDelete(id);

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    return res.status(200).json({ message: "Timesheet deleted successfully" });
  } catch (err) {
    console.error("Error deleting timesheet:", err);
    return res
      .status(500)
      .json({ message: "Error deleting timesheet", error: err.message });
  }
};

// Finalize timesheet
export const finalizeTimesheet = async (req, res) => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findById(id);

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    // Check if timesheet is already finalized
    if (timesheet.isFinalized) {
      return res
        .status(400)
        .json({ message: "Timesheet is already finalized" });
    }

    // Finalize timesheet
    timesheet.isFinalized = true;
    await timesheet.save();

    return res.status(200).json({ message: "Timesheet finalized", timesheet });
  } catch (err) {
    console.error("Error finalizing timesheet:", err);
    return res
      .status(500)
      .json({ message: "Error finalizing timesheet", error: err.message });
  }
};
