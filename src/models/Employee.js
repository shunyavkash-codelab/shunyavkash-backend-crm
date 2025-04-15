// import mongoose from "mongoose";

// const employeeSchema = new mongoose.Schema({
//   avatar: {
//     type: String,
//     default: "",
//   },
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   phone: {
//     type: String,
//   },
//   designation: {
//     type: String,
//   },
//   dateOfJoining: {
//     type: Date,
//   },
//   salary: {
//     type: Number,
//   },
//   status: {
//     type: String,
//     enum: ["Active", "Inactive", "Terminated"],
//     default: "Active",
//   },
//   address: {
//     type: String,
//   },
//   documents: [
//     {
//       name: String, // e.g., "Resume", "Offer Letter"
//       url: String, // File storage URL or path
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Employee", employeeSchema);

import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "",
  },
  avatarPublicId: {
    type: String,
    default: "",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  designation: {
    type: String,
  },
  dateOfJoining: {
    type: Date,
  },
  salary: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Terminated"],
    default: "Active",
  },
  address: {
    type: String,
  },
  documents: [
    {
      name: String, // e.g., "Resume", "Offer Letter"
      url: String, // File storage URL or path
      publicId: String, // Cloudinary public ID for deletion
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Employee", employeeSchema);
