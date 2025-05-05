// import mongoose from "mongoose";

// const invoiceSchema = new mongoose.Schema({
//   client: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Client",
//     required: true,
//   },
//   timesheets: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Timesheet",
//       required: true,
//     },
//   ],
//   totalHours: {
//     type: Number,
//     required: true,
//   },
//   ratePerHour: {
//     type: Number,
//     required: true,
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["Draft", "Finalized", "Paid"],
//     default: "Draft",
//   },
//   issuedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   dueDate: {
//     type: Date,
//   },
// });

// export default mongoose.model("Invoice", invoiceSchema);

import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
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
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    // Add these new fields for Cloudinary management
    pdfUrl: {
      type: String,
      required: false, // Not required for draft invoices
    },
    pdfExists: {
      type: Boolean,
      default: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: false,
    },
    // Optional: Add metadata fields
    pdfGeneratedAt: {
      type: Date,
      default: null,
    },
    pdfVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Add index for better query performance
invoiceSchema.index({ client: 1, status: 1 });
invoiceSchema.index({ cloudinaryPublicId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Invoice", invoiceSchema);
