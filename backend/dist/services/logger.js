"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsDir = path_1.default.join(__dirname, '../../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const getLogFileName = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}.log`;
};
const writeLog = (level, message, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
    const logFile = path_1.default.join(logsDir, getLogFileName());
    fs_1.default.appendFileSync(logFile, logEntry);
    if (process.env.NODE_ENV === 'development') {
        console.log(logEntry.trim());
    }
};
exports.logger = {
    info: (message, data) => writeLog('info', message, data),
    error: (message, data) => writeLog('error', message, data),
    warn: (message, data) => writeLog('warn', message, data),
    debug: (message, data) => writeLog('debug', message, data)
};
