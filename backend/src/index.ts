/**
 * Entry point for Cardify Backend API
 * Minimal Express + MongoDB + TypeScript setup for Render deployment
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables first
dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  throw new Error('❌ Missing MONGO_URI environment variable');
}

if (!process.env.JWT_SECRET) {
  throw new Error('❌ Missing JWT_SECRET environment variable');
}

const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);

// Basic middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL || 'https://cardify-app-new.vercel.app', 'https://cardify-app-new.vercel.app']
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3008'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Cardify API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Cardify API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Basic route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Cardify API',
    version: '1.0.0',
    status: 'active'
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with retry logic
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI!;
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      authSource: 'admin'
    });
    
    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection failed:', error);
    
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.log('🔄 Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Start server independently of MongoDB connection
  app.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Cardify API Server running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    // eslint-disable-next-line no-console
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    // eslint-disable-next-line no-console
    console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
  });
  
  // Connect to MongoDB
  connectDB();
}

export default app;
