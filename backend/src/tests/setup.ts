// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/cardify-test';
process.env.PORT = '3007'; // Use different port for tests

// Increase timeout for database operations
jest.setTimeout(30000);
