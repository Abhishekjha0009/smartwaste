import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect Database
connectDB();

// Initialize Real-time Socket Service
initSocket(io);

// Express Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

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
    system: 'SmartWaste API Gateway',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Active (Gemini Vision)' : 'Active (Integrated AI Classifier)'
  });
});

// Global Error Handler
app.use(errorHandler);

let PORT = parseInt(process.env.PORT || '5001', 10);

const startServer = (portToTry) => {
  server.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`🚀 SmartWaste Server running on port ${portToTry}`);
    console.log(`📡 Socket.IO Real-time Engine initialized`);
    console.log(`🤖 AI Vision Gateway Ready`);
    console.log(`====================================================`);
  });
};

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Port Conflict] Port ${PORT} is currently in use. Trying port ${PORT + 1}...`);
    PORT = PORT + 1;
    setTimeout(() => startServer(PORT), 500);
  } else {
    console.error('[Server Error]', err);
  }
});

startServer(PORT);

