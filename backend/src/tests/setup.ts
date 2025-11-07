// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/cardify-test';
process.env.PORT = '0'; // Use random available port for tests

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console.log during tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
};
