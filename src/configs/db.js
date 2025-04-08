import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error(" MongoDB Connection Error:", err.message);
      process.exit(1);
    });
};

export default connectDB;
