import logger from '../../../utils/loggerUtils.js';
import Leave from '../Leave.js';

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newLeave = new Leave({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    logger.error('Error applying for leave:', err);
    res
      .status(500)
      .json({ message: 'Failed to apply for leave', error: err.message });
  }
};

// Get leaves of logged-in employee
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id });

    if (!leaves.length) {
      return res.status(404).json({ message: 'No leave records found' });
    }

    res.json(leaves);
  } catch (err) {
    logger.error('Error fetching leaves:', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch leaves', error: err.message });
  }
};

// Admin: Get all leave requests
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate(
      'employee',
      'firstName lastName email'
    );

    if (!leaves.length) {
      return res.status(404).json({ message: 'No leave requests found' });
    }

    res.json(leaves);
  } catch (err) {
    logger.error('Error fetching all leaves:', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch leave requests', error: err.message });
  }
};

// Admin: Approve or Reject leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.status = status;
    await leave.save();

    res.json(leave);
  } catch (err) {
    logger.error('Error updating leave status:', err);
    res
      .status(500)
      .json({ message: 'Failed to update leave status', error: err.message });
  }
};

// Delete leave request
export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // If user is not admin, ensure they own the leave and it is still pending
    if (req.user.role !== 'admin') {
      if (leave.employee.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: 'You are not authorized to delete this leave' });
      }
      if (leave.status !== 'Pending') {
        return res
          .status(400)
          .json({ message: 'Only pending leaves can be deleted' });
      }
    }

    await leave.deleteOne();
    res.json({ message: 'Leave deleted successfully' });
  } catch (err) {
    logger.error('Error deleting leave:', err);
    res
      .status(500)
      .json({ message: 'Failed to delete leave', error: err.message });
  }
};
