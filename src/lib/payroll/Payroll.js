import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number, // 1 = Jan, 12 = Dec
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    presentDays: {
      type: Number,
      default: 0,
    },
    absentDays: {
      type: Number,
      default: 0,
    },
    leaveDays: {
      type: Number,
      default: 0,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Generated", "Paid"],
      default: "Generated",
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);
