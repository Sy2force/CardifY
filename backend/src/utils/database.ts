import mongoose from 'mongoose';
import { logger } from '../services/logger';

export const connectDB = async (): Promise<void> => {
  try {
    // Check if already connected to avoid multiple connections
    if (mongoose.connection.readyState === 1) {
      if (process.env.NODE_ENV !== 'test') {
        logger.info('✅ MongoDB already connected');
      }
      return;
    }

    const mongoUri = process.env.NODE_ENV === 'test' 
      ? process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/cardify_test'
      : process.env.MONGO_URI || 'mongodb://localhost:27017/cardify';
    
    await mongoose.connect(mongoUri);
    
    if (process.env.NODE_ENV !== 'test') {
      logger.info('✅ MongoDB connected');
    }
  } catch (error) {
    logger.error('❌ MongoDB connection error', { error: String(error) });
    // Don't exit process in test environment to avoid crashing Jest
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error; // Re-throw error in test environment
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    if (process.env.NODE_ENV !== 'test') {
      logger.info('📴 MongoDB disconnected');
    }
  } catch (error) {
    logger.error('❌ MongoDB disconnection error', { error: String(error) });
  }
};

export const clearDB = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    logger.error('❌ Error clearing database', { error: String(error) });
  }
};
