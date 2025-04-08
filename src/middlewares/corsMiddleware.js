import cors from "cors";

const allowedOrigins = ["http://localhost:5173"]; // Add more origins if needed

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true,
};

export default cors(corsOptions);
