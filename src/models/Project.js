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
    default: "Normal",
  },
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  assignedEmployees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Project", projectSchema);
