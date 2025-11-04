import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middlewares/error';
import userRoutes from './routes/user.routes';
import cardRoutes from './routes/card.routes';
import { logger } from './services/logger';

// Load environment variables - check multiple locations for flexibility
if (process.env.NODE_ENV === 'production') {
  dotenv.config(); // Use default .env in production
} else {
  dotenv.config({ path: path.join(__dirname, '../../.env') }); // Local development
}

const app = express();
const PORT = parseInt(process.env.PORT || '3006', 10);

// Configure middleware for CORS, logging, and request parsing
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL || 'https://cardify.vercel.app', 'https://cardify.vercel.app', 'https://www.cardify.vercel.app']
  : ['http://localhost:3008', 'http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route definitions
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cardify API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);

// Global error handling middleware
app.use(errorHandler);

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start the server
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cardify';
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI (masked):', mongoUri.replace(/\/\/.*@/, '//***:***@'));

// Configure mongoose with better timeout settings
mongoose.set('strictQuery', false);

// Start server even if MongoDB fails initially
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`🚀 Cardify API server running on port ${PORT}`);
});

const connectWithRetry = () => {
  mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 20000, // 20 seconds
    connectTimeoutMS: 10000, // 10 seconds
    maxPoolSize: 5,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    w: 'majority',
    authSource: 'admin'
  })
  .then(() => {
    logger.info('Connected to MongoDB successfully');
    console.log('✅ MongoDB connected');
  })
  .catch((error) => {
    logger.error('Database connection error:', error);
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Don't retry indefinitely in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Production environment - will not retry MongoDB connection');
      return;
    }
    
    console.log('Retrying connection in 10 seconds...');
    setTimeout(connectWithRetry, 10000);
  });
};

connectWithRetry();

export default app;
