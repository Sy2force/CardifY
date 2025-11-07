import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middlewares/error';
import { generalLimiter } from './middlewares/rateLimit';
import userRoutes from './routes/user.routes';
import cardRoutes from './routes/card.routes';
import uploadRoutes from './routes/upload.routes';
import { logger } from './services/logger';

// Load environment variables - check multiple locations for flexibility
if (process.env.NODE_ENV === 'production') {
  dotenv.config(); // Use default .env in production
} else {
  dotenv.config({ path: path.join(__dirname, '../../.env') }); // Local development
}

const app = express();
const PORT = parseInt(process.env.PORT || '3006', 10);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Configure middleware for CORS, logging, and request parsing
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL || 'https://cardify.vercel.app', 'https://cardify.vercel.app', 'https://www.cardify.vercel.app']
  : ['http://localhost:3008', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:3010'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Apply rate limiting
app.use(generalLimiter);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API route definitions
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cardify API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/upload', uploadRoutes);

// Global error handling middleware
app.use(errorHandler);

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configure mongoose with better timeout settings
mongoose.set('strictQuery', false);

// Only connect to MongoDB and start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Connect to MongoDB and start the server
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cardify';
  logger.info('Attempting to connect to MongoDB...');
  logger.info('MongoDB URI (masked):', { uri: mongoUri.replace(/\/\/.*@/, '//***:***@') });

  const connectWithRetry = (): void => {
    mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 20000, // 20 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      authSource: 'admin'
    }).then(() => {
      logger.info('✅ MongoDB connected successfully');
    }).catch((error) => {
      logger.error('❌ MongoDB connection failed:', { error: error.message });
      
      if (process.env.NODE_ENV === 'production') {
        // In production, retry less aggressively
        setTimeout(connectWithRetry, 30000);
        return;
      }
      
      logger.info('Retrying connection in 10 seconds...');
      setTimeout(connectWithRetry, 10000);
    });
  };

  connectWithRetry();

  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Cardify API server running on port ${PORT}`);
  });
}

export default app;
