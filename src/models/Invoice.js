import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  timesheets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timesheet",
      required: true,
    },
  ],
  totalHours: {
    type: Number,
    required: true,
  },
  ratePerHour: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Finalized", "Paid"],
    default: "Draft",
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
});

export default mongoose.model("Invoice", invoiceSchema);
