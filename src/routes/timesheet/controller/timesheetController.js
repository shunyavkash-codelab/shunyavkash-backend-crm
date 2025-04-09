import Timesheet from "../../../models/Timesheet.js";

//  Create new timesheet entry
export const createTimesheet = async (req, res) => {
  try {
    const { employee, project, date, hoursWorked, description } = req.body;

    if (!employee || !project || !date || !hoursWorked) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const timesheet = await Timesheet.create({
      employee,
      project,
      date,
      hoursWorked,
      description,
    });

    res.status(201).json(timesheet);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating timesheet", error: err.message });
  }
};

//  Get all timesheets
export const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find()
      .populate("employee", "email role")
      .populate("project", "title");

    res.status(200).json(timesheets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching timesheets", error: err.message });
  }
};

//  Update timesheet by ID
export const updateTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    res.status(200).json(timesheet);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating timesheet", error: err.message });
  }
};

//  Delete timesheet
export const deleteTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByIdAndDelete(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    res.status(200).json({ message: "Timesheet deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting timesheet", error: err.message });
  }
};

//  Finalize timesheet
export const finalizeTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByIdAndUpdate(
      req.params.id,
      { isFinalized: true },
      { new: true }
    );

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    res.status(200).json({ message: "Timesheet finalized", timesheet });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error finalizing timesheet", error: err.message });
  }
};
