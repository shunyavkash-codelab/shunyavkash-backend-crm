import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the employee
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // reference to the project
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hoursWorked: {
    type: Number,
    required: true,
  },
  description: {
    type: String, // what they worked on
  },
  isFinalized: {
    type: Boolean,
    default: false, // once true, admin can't modify
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Timesheet", timesheetSchema);
