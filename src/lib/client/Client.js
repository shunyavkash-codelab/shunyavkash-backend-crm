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

  //  NEW FIELDS
  address: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "INR", "GBP", "AUD"],
    default: "USD",
  },
  industry: {
    type: String,
    enum: ["IT", "Healthcare", "Education", "Finance", "Retail", "Other"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.Client || mongoose.model("Client", clientSchema);
