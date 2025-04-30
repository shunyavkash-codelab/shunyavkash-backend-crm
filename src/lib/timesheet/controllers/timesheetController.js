import Timesheet from "../Timesheet.js";
import Invoice from "../../invoice/Invoice.js";

// Create a new timesheet
export const createTimesheet = async (req, res) => {
  try {
    const { project, date, hoursWorked, description, status, user } = req.body;
    console.log("req.body:", req.body);

    // Check if user is passed in request, else fallback to req.user._id
    const userId = user || req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "user ID is required" });
    }

    const newEntry = new Timesheet({
      project,
      date,
      hoursWorked,
      description,
      status,
      user: userId,
    });

    // Save the new timesheet entry
    await newEntry.save();

    // Populate the necessary fields
    const populated = await newEntry.populate([
      { path: "project" },
      { path: "user", select: "firstName lastName email role" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating timesheet:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all timesheets
export const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find({
      $or: [{ user: req.user._id }, { user: null }],
    })
      .populate("user", "firstName lastName email role")
      .populate("project", "title")
      .sort({ date: -1 }); // Newest first

    // console.log("backend timesheets:", timesheets);
    return res.status(200).json(timesheets);
  } catch (err) {
    console.error("Error fetching timesheets:", err);
    return res.status(500).json({
      message: "Error fetching timesheets",
      error: err.message,
    });
  }
};

// Get single timesheet by ID
export const getTimesheetById = async (req, res) => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findById(id)
      .populate("user", "firstName lastName email role")
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
    const updateData = { ...req.body };

    if (updateData.description !== undefined) {
      updateData.description = Array.isArray(updateData.description)
        ? updateData.description
        : updateData.description.split(",").map((t) => t.trim());
    }

    // Update and then populate
    const timesheet = await Timesheet.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user")
      .populate("project"); // <-- Populated: user and project

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    return res.status(200).json(timesheet);
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
