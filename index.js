import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/configs/db.js";
import mainRoutes from "./src/routes/indexRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();

app.use("/api", mainRoutes);

app.get("/", (req, res) => {
  res.send("CRM API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
