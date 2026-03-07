
import path from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import nbfcRoutes from './routes/nbfc.routes';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import applicationRoutes from './routes/application.routes';
import adminRoutes from './routes/admin.routes';


if (!process.env.PORT) {
  console.warn('⚠️ PORT not defined, using default 5000');
}

const app: Application = express();


app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);


app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nbfc', nbfcRoutes); 


app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});


app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});


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