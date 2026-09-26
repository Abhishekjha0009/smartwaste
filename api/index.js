import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/config/db.js';
import { errorHandler } from '../server/middleware/errorHandler.js';

// Route Imports
import authRoutes from '../server/routes/authRoutes.js';
import complaintRoutes from '../server/routes/complaintRoutes.js';
import analyticsRoutes from '../server/routes/analyticsRoutes.js';
import userRoutes from '../server/routes/userRoutes.js';
import aiRoutes from '../server/routes/aiRoutes.js';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure DB connection in Serverless environment
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in Vercel function:', err);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SmartWaste API Gateway (Vercel Serverless)',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Active (Gemini Vision)' : 'Active (Integrated AI Classifier)'
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
