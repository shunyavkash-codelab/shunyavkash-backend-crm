import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  startDate: Date,
  endDate: Date,
  priority: {
    type: String,
    enum: ["urgent", "high", "normal", "low"],
    default: "normal",
  },
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  assignedEmployees: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      role: String,
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
