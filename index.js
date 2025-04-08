import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/configs/db.js";
import mainRoutes from "./src/routes/indexRoute.js";
import corsMiddleware from "./src/middlewares/corsMiddleware.js";

dotenv.config();

const app = express();
app.use(corsMiddleware);
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
