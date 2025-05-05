import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    interviewDate: {
      type: Date,
      required: true,
    },
    interviewTime: {
      type: String,
      required: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    mode: {
      type: String,
      enum: ["Online", "Offline"],
      //   required: true,
    },
    resume: {
      name: String,
      url: String,
    },
    resumePublicId: {
      type: String,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
