import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactPerson: String,
  email: {
    type: String,
    required: true,
  },
  phone: String,
  billingAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Client", clientSchema);
