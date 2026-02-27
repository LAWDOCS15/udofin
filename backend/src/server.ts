import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import path from "path"; 
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import applicationRoutes from './routes/application.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to parse URL-encoded bodies safely
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Authentication routes
app.use("/api/auth", authRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});