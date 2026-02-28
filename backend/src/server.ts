// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors"; 
// import path from "path"; 
// import { connectDB } from "./config/db";
// import authRoutes from "./routes/auth.routes";
// import applicationRoutes from './routes/application.routes';
// import adminRoutes from './routes/admin.routes';

// dotenv.config();
// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", 
//     credentials: true, 
//   })
// );

// // Standard Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Added to parse URL-encoded bodies safely
// app.use(cookieParser());

// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // Authentication routes
// app.use("/api/auth", authRoutes);

// // Application routes
// app.use("/api/applications", applicationRoutes);

// // Admin routes
// app.use("/api/admin", adminRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import applicationRoutes from './routes/application.routes';
import adminRoutes from './routes/admin.routes';

/* =====================================================
   ENV CONFIG
===================================================== */


if (!process.env.PORT) {
  console.warn('⚠️ PORT not defined, using default 5000');
}

/* =====================================================
   APP INITIALIZATION
===================================================== */

const app: Application = express();

/* =====================================================
   SECURITY MIDDLEWARE
===================================================== */

// Secure HTTP headers
app.use(helmet());

// Rate limiting (prevent brute force & abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

/* =====================================================
   STANDARD MIDDLEWARE
===================================================== */

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* =====================================================
   STATIC FILES
===================================================== */

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

/* =====================================================
   ROUTES
===================================================== */

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

/* =====================================================
   404 HANDLER
===================================================== */

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error('Global Error:', err.message);

    res.status(500).json({
      message: 'Internal server error',
    });
  }
);

/* =====================================================
   SERVER START
===================================================== */

const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();