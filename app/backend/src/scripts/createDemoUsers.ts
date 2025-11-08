import mongoose from 'mongoose';
import User from '../models/user.model';
import { logger } from '../services/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Demo users configuration
 * These accounts are created for testing and demonstration purposes
 */
const DEMO_USERS = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@cardify.com',
    password: 'admin123',
    phone: '+33123456789',
    isAdmin: true,
    isBusiness: true
  },
  {
    firstName: 'Sarah',
    lastName: 'Cohen',
    email: 'sarah@example.com',
    password: 'business123',
    phone: '+33987654321',
    isAdmin: false,
    isBusiness: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'user123',
    phone: '+33555666777',
    isAdmin: false,
    isBusiness: false
  }
] as const;

/**
 * Interface for demo user data
 */
export interface DemoUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isAdmin: boolean;
  isBusiness: boolean;
}

/**
 * Validates demo user data structure
 * @param userData - The user data to validate
 * @returns boolean - True if valid, false otherwise
 */
const validateDemoUserData = (userData: unknown): userData is DemoUserData => {
  return (
    typeof userData === 'object' &&
    userData !== null &&
    typeof (userData as Record<string, unknown>).firstName === 'string' &&
    typeof (userData as Record<string, unknown>).lastName === 'string' &&
    typeof (userData as Record<string, unknown>).email === 'string' &&
    typeof (userData as Record<string, unknown>).password === 'string' &&
    typeof (userData as Record<string, unknown>).phone === 'string' &&
    typeof (userData as Record<string, unknown>).isAdmin === 'boolean' &&
    typeof (userData as Record<string, unknown>).isBusiness === 'boolean' &&
    ((userData as Record<string, unknown>).email as string).includes('@') &&
    ((userData as Record<string, unknown>).firstName as string).length > 0 &&
    ((userData as Record<string, unknown>).lastName as string).length > 0 &&
    ((userData as Record<string, unknown>).password as string).length >= 6
  );
};

/**
 * Creates demo users in the database if they don't already exist
 * @returns Promise<void>
 * @throws Error if user creation fails
 */
export const createDemoUsers = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting demo users creation process...');
    
    let createdCount = 0;
    let existingCount = 0;
    
    for (const userData of DEMO_USERS) {
      try {
        // Validate user data before processing
        if (!validateDemoUserData(userData)) {
          const userRecord = userData as Record<string, unknown>;
          logger.error(`❌ Invalid user data structure for: ${userRecord.email || 'unknown'}`);
          continue;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (!existingUser) {
          const user = new User(userData);
          await user.save();
          createdCount++;
          const roleLabel = userData.isAdmin ? 'Admin' : userData.isBusiness ? 'Business' : 'User';
          logger.info(`✅ Demo user created: ${userData.email} (${roleLabel})`);
        } else {
          existingCount++;
          logger.info(`ℹ️  Demo user already exists: ${userData.email}`);
        }
      } catch (userError) {
        logger.error(`❌ Failed to create user ${userData.email}:`, { error: String(userError) });
        // Continue with other users instead of failing completely
      }
    }
    
    logger.info(`🎉 Demo users creation completed! Created: ${createdCount}, Existing: ${existingCount}`);
  } catch (error) {
    logger.error('💥 Error in demo users creation process:', { error: String(error) });
    throw error;
  }
};

/**
 * Main execution function when script is run directly
 * Handles MongoDB connection, user creation, and cleanup
 */
const runScript = async (): Promise<void> => {
  let isConnected = false;
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      logger.error('MONGO_URI environment variable is required');
      process.exit(1);
    }
    logger.info(`🔌 Connecting to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***@')}`);
    
    await mongoose.connect(mongoUri);
    isConnected = true;
    logger.info('✅ Connected to MongoDB successfully');
    
    // Create demo users
    await createDemoUsers();
    
  } catch (error) {
    logger.error('💥 Script execution failed:', { 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  } finally {
    // Ensure MongoDB connection is closed
    if (isConnected) {
      try {
        await mongoose.disconnect();
        logger.info('🔌 Disconnected from MongoDB');
      } catch (disconnectError) {
        logger.error('⚠️  Error disconnecting from MongoDB:', { error: String(disconnectError) });
      }
    }
    
    logger.info('🏁 Script execution completed');
    process.exit(0);
  }
};

// Run script if called directly
if (require.main === module) {
  // Handle process termination gracefully
  process.on('SIGINT', async () => {
    logger.info('🛑 Received SIGINT, shutting down gracefully...');
    await mongoose.disconnect();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    logger.info('🛑 Received SIGTERM, shutting down gracefully...');
    await mongoose.disconnect();
    process.exit(0);
  });
  
  runScript();
}
