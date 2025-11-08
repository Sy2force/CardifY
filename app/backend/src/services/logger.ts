// Logging service - Centralized log management with daily files
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Generate log filename based on current date
const getLogFileName = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}.log`; // Format: YYYY-MM-DD.log
};

// Write log entry to daily log file
const writeLog = (level: string, message: string, data?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
  
  const logFile = path.join(logsDir, getLogFileName());
  fs.appendFileSync(logFile, logEntry);
  
  // Console output in development only
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(logEntry.trim()); // Display for local debugging
  }
};

// Centralized logger with different log levels
export const logger = {
  info: (message: string, data?: Record<string, unknown>): void => writeLog('info', message, data),   // General information
  error: (message: string, data?: Record<string, unknown>): void => writeLog('error', message, data), // Critical errors
  warn: (message: string, data?: Record<string, unknown>): void => writeLog('warn', message, data),   // Warnings
  debug: (message: string, data?: Record<string, unknown>): void => writeLog('debug', message, data)  // Development debugging
};
