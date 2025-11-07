import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getLogFileName = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}.log`;
};

const writeLog = (level: string, message: string, data?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
  
  const logFile = path.join(logsDir, getLogFileName());
  fs.appendFileSync(logFile, logEntry);
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    // Use logger instead of console in production
  }
};

export const logger = {
  info: (message: string, data?: Record<string, unknown>): void => writeLog('info', message, data),
  error: (message: string, data?: Record<string, unknown>): void => writeLog('error', message, data),
  warn: (message: string, data?: Record<string, unknown>): void => writeLog('warn', message, data),
  debug: (message: string, data?: Record<string, unknown>): void => writeLog('debug', message, data)
};
