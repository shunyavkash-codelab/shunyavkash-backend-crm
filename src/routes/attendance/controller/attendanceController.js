import Attendance from "../../../models/Attendance.js";
import Employee from "../../../models/Employee.js";

// 1. Employee Check-In
export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    // Prevent duplicate check-in
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });
    if (existing) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: new Date(),
      status: "Present",
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Employee Check-Out
export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No check-in record found for today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({ message: "Checked out successfully", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Mark Leave (Admin Only)
export const markLeave = async (req, res) => {
  try {
    const { employeeId, date, note } = req.body;

    const formattedDate = new Date(date).setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      employee: employeeId,
      date: formattedDate,
    });
    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already exists for this date" });
    }

    const leave = await Attendance.create({
      employee: employeeId,
      date: formattedDate,
      status: "Leave",
      note,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get All Attendance
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate(
      "employee",
      "firstName lastName email"
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Get Attendance by Employee
export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await Attendance.find({ employee: employeeId }).sort({
      date: -1,
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Delete Attendance (Admin only)
export const deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Attendance deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
