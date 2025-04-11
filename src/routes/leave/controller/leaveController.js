import Leave from "../../../models/Leave.js";

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const newLeave = new Leave({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to apply for leave", error: err.message });
  }
};

// Get leaves of logged-in employee
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id });
    res.json(leaves);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch leaves", error: err.message });
  }
};

// Admin: Get all leave requests
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate(
      "employee",
      "firstName lastName email"
    );
    res.json(leaves);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch leave requests", error: err.message });
  }
};

// Admin: Approve or Reject leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = req.body.status;
    await leave.save();

    res.json(leave);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update leave status", error: err.message });
  }
};

// Delete leave request
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // If user is not admin, ensure they own the leave and it is still pending
    if (req.user.role !== "admin") {
      if (leave.employee.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this leave" });
      }
      if (leave.status !== "Pending") {
        return res
          .status(400)
          .json({ message: "Only pending leaves can be deleted" });
      }
    }

    await leave.deleteOne();
    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete leave", error: err.message });
  }
};
