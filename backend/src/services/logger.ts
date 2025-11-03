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

const writeLog = (level: string, message: string, data?: any): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
  
  const logFile = path.join(logsDir, getLogFileName());
  fs.appendFileSync(logFile, logEntry);
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(logEntry.trim());
  }
};

export const logger = {
  info: (message: string, data?: any) => writeLog('info', message, data),
  error: (message: string, data?: any) => writeLog('error', message, data),
  warn: (message: string, data?: any) => writeLog('warn', message, data),
  debug: (message: string, data?: any) => writeLog('debug', message, data)
};
