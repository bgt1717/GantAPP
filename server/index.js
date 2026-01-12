// server/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Middleware
import { protect } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------

// Enable CORS for multiple origins (dev + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",               // local Vite
  "https://ganttapp-pe5h.onrender.com", // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server, Postman, etc.
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Optional: simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- ROUTES ----------

// Auth routes
app.use("/auth", authRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Task routes: use mergeParams in task router so projectId is accessible
app.use("/api/projects/:projectId/tasks", taskRoutes);

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

// ---------- DATABASE CONNECTION ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
