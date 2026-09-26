import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartwaste', {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection error: ${error.message}`);
    console.warn(`[Database Warning] Operating in fallback mode or check local MongoDB / MongoDB Atlas string.`);
  }
};

