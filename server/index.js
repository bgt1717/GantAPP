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

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
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

app.use("/auth", authRoutes);
app.use("/api/projects", projectRoutes);
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
  console.log(`Server running on http://localhost:${PORT}`);
});
