import "dotenv/config";

import express from "express";
import connectDB from "./configs/db.js";
import mainRoutes from "./router.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import "./cronJobs/invoiceCleanup.js";

const app = express();
app.use(corsMiddleware);
const PORT = process.env.PORT || 5000;
app.use(express.json());
// connectDB();

app.use("/api", mainRoutes);

app.get("/", (req, res) => {
  res.send("CRM API is running...");
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
