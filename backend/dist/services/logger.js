"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// Logging service - Centralized log management with daily files
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create logs directory if it doesn't exist
const logsDir = path_1.default.join(__dirname, '../../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Generate log filename based on current date
const getLogFileName = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}.log`; // Format: YYYY-MM-DD.log
};
// Write log entry to daily log file
const writeLog = (level, message, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
    const logFile = path_1.default.join(logsDir, getLogFileName());
    fs_1.default.appendFileSync(logFile, logEntry);
    // Console output in development only
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(logEntry.trim()); // Display for local debugging
    }
};
// Centralized logger with different log levels
exports.logger = {
    info: (message, data) => writeLog('info', message, data), // General information
    error: (message, data) => writeLog('error', message, data), // Critical errors
    warn: (message, data) => writeLog('warn', message, data), // Warnings
    debug: (message, data) => writeLog('debug', message, data) // Development debugging
};
