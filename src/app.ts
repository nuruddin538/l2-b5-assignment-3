import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./app/routes/book";
import borrowRoutes from "./app/routes/borrow";
import { errorHandler, notFoundHandler } from "./utils/errorHandler";

dotenv.config();

const app = express();

// Middlerware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Error Handing
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
